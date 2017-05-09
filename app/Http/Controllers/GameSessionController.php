<?php

namespace App\Http\Controllers;

use App\Models\GameInventory;
use App\Models\GameSession;
use App\Models\User;
use App\Utils\Helpers;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;


class GameSessionController extends Controller {
    /**
     * @param $org string id or short_name of Organization
     * @return \Illuminate\Http\JsonResponse Sessions for the Organization
     */
    public function getOrgSessions($org) {
        return $this->getOrgSessionsState($org, "all");
    }

    /**
     * @param $org string id or short_name of Organization
     * @param $state Status of the sessions in question ['open', 'future', 'past', 'now', 'all']
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrgSessionsState($org, $state) {
        $q = Helpers::withOffsets(GameSession::byOrgQuery($org));
        switch ($state) {
            case 'open':
                // sessions where start time is in the future and max_players !== users.count
                $sessions = $q->where('start_time', '>', Carbon::now())->orderBy('start_time')->get()
                    ->filter(function ($s) {
                        return $s->game->max_players > sizeof($s->users);
                    });
                break;
            case 'future':
                // sessions where start time is in the future
                $sessions = $q->where('start_time', '>', Carbon::now())->orderBy('start_time')->get();
                break;
            case 'past':
                // sessions where end time is in the past
                $sessions = $q->where('end_time', '<', Carbon::now())->orderBy('start_time')->get();
                break;
            case 'now':
                // sessions where end time is in the future and start time is in the past
                $sessions = $q->where('start_time', '<', Carbon::now())
                    ->where('end_time', '>', Carbon::now())->orderBy('start_time')->get();
                break;
            case 'all':
                $sessions = $q->get();
                break;
            default:
                return response()->json([
                    'error' => "INVALID_SESSION_STATE",
                ], 400);
        }

        // return values
        if (isset($sessions) && sizeof($sessions)) {
            return response()->json([
                'sessions' => $sessions,
            ]);
        }
        return response()->json([
            'error' => "NO_SESSIONS_FOUND",
        ], 404);
    }

    /**
     * Searches for sessions belonging to an organization based on a query string
     * @param $org Organization the sessions belong to
     * @param $sessionQuery string search
     * @param bool $openOnly whether or not to include only open sessions
     * @return \Illuminate\Http\JsonResponse Clean list of sessions
     */
    public function getOrgSessionsQuery($org, $sessionQuery, $openOnly = false) {
        // TODO see if you can generify the search code below to work with leagues
        $sessionsByGame = GameSession::byOrgQuery($org)
            ->where('end_time', '>', Carbon::now())
            ->whereHas('game', function ($subQuery) use ($sessionQuery) {
                $subQuery->where('name', 'like', "%$sessionQuery%");
            });

        $sessionsByLeague = GameSession::byOrgQuery($org)
            ->where('end_time', '>', Carbon::now())
            ->whereHas('league', function ($subQuery) use ($sessionQuery) {
                $subQuery->where('name', 'like', "%$sessionQuery%");
            });

        $sessionsByNotes = GameSession::byOrgQuery($org)
            ->where('end_time', '>', Carbon::now())
            ->where('note', 'like', "%$sessionQuery%");

        $union = $sessionsByGame->union($sessionsByNotes)->union($sessionsByLeague)
            ->orderBy('start_time');

        // include or exclude sessions without open slots
        if ($openOnly) {
            $sessions = $union->get()->filter(function ($s) {
                return $s->game->max_players > sizeof($s->users);
            });
            // can't use Helpers::withOffsets() because it will work before the filtering happens
            $request = request();
            // skip and take
            if ($request->has('skip'))
                $sessions = $sessions->slice($request->skip);
            if ($request->has('take'))
                $sessions = $sessions->take($request->take);
        } else {
            $sessions = Helpers::withOffsets($union)->get();
        }

        // return values
        if (isset($sessions) && sizeof($sessions)) {
            return response()->json([
                'sessions' => $sessions,
            ]);
        }
        return response()->json([
            'error' => "NO_SESSIONS_FOUND",
        ], 404);
    }

    /**
     * @param $sid GameSession id
     * @return mixed JSON object representing session and associated models
     */
    public function getSession($sid) {
        $s = GameSession::simplify(GameSession::where('id', '=', $sid))->get();

        if ($s && sizeof($s)) {
            return response()->json([
                'game_session' => $s,
            ]);
        }
        return response()->json([
            'error' => "NO_SESSIONS_FOUND",
        ], 404);
    }

    /**
     * Attempts to sign the currently logged in user up for the session
     * @param $sid GameSession id
     * @return \Illuminate\Http\JsonResponse error or message indicating result
     */
    public function postSignUp($sid) {
        $user = User::getTokenUser();
        if ($user instanceof Response)
            return $user;

        if (!$session = GameSession::find($sid))
            return response()->json(['error' => 'SESSION_NOT_FOUND'], 401);

        // load future sessions
        $userSessions = $user->gameSessions()
            ->where('start_time', '>', Carbon::now())
            ->get();

        // check for max sessions
        if ($userSessions->count() > User::$maxSessions)
            return response()->json(['error' => 'USER_HAS_TOO_MANY_SESSIONS'], 403);

        // check for time conflict
        foreach ($userSessions as $us) { // a filter would take longer since it has to go through all elements
            if (Helpers::periodOverlap($us->start_time, $us->end_time, $session->start_time, $session->end_time)) {
                return response()->json([
                    'error' => 'SESSION_OVERLAP_WITH_OTHER_SESSION',
                    'other_session' => $us
                ]);
            }
        }

        // check if the session is open
        if (!$session->openSlots())
            return response()->json(['error' => 'SESSION_FULL'], 403);

        // check if the user is signed up
        if ($session->isSignedUp($user->id))
            return response()->json(['error' => 'ALREADY_SIGNED_UP'], 403);

        // sign up
        $user->gameSessions()->attach($session);
        return response()->json(['message' => 'SUCCESS']);
    }

    // todo add sponsor note

    /**
     * Creates a new GameSession with the user as the first member. Validates dates, session
     * overlaps (based on user and other sessions), and org inventories.
     * @param Request $request
     * @return mixed
     */
    public function postCreateSession(Request $request) {
        $validator = Validator::make($request->all(), [
            'note' => 'string|max:255',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'game_id' => 'required|exists:games,id',
            'league_id' => 'exists:leagues,id',
            'organization_id' => 'required|exists:organizations,id'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return response()->json(['error' => 'INVALID_TOKEN'], 401);
        }

        // load future sessions
        $userSessions = $user->gameSessions()
            ->where('start_time', '>', Carbon::now())
            ->get();

        $startTime = Carbon::createFromFormat("m/d/Y H:i", Input::get('start_time'));
        $endTime = Carbon::createFromFormat("m/d/Y H:i", Input::get('end_time'));

        // check for max sessions
        if ($userSessions->count() > User::$maxSessions)
            return response()->json(['error' => 'USER_HAS_TOO_MANY_SESSIONS'], 403);

        // check for time conflict
        foreach ($userSessions as $session) { // a filter would take longer since it has to go through all elements
            if (Helpers::periodOverlap($session->start_time, $session->end_time, $startTime, $endTime)) {
                return response()->json([
                    'error' => 'SESSION_OVERLAP_WITH_OTHER_SESSION',
                    'other_session' => $session
                ]);
            }
        }

        // make sure org has enough game inventory
        $gameInv = GameInventory::where('game_id', '=', Input::get('game_id'))
            ->where('organization_id', '=', Input::get('organization_id'))
            ->where('count', '>', 0)
            ->with('organization')
            ->first();

        if (!$gameInv)
            return response()->json(['error' => 'NO_GAME_UNITS_AVAILABLE']);

        // get all future sessions for this game/org and filter through them to look for inventory
        $otherSessions = GameSession::where('game_id', '=', Input::get('game_id'))
            ->where('organization_id', '=', Input::get('organization_id'))
            ->where('end_time', '>', Carbon::now())
            ->get();

        $otherSessionsOverlap = $otherSessions->filter(function ($os) use ($startTime, $endTime) {
            return Helpers::periodOverlap($startTime, $endTime, $os->start_time, $os->end_time);
        });

        if ($otherSessionsOverlap->count() >= $gameInv->count)
            return response()->json(['error' => 'NO_GAME_UNITS_AVAILABLE']);

        // create session
        Input::merge(['start_time' => $startTime, 'end_time' => $endTime]); // fix formatting
        $newSession = GameSession::create(Input::all());
        $user->gameSessions()->attach($newSession);

        return response()->json([
            'success' => 'GAME_SESSION_CREATED',
            'game_session' => $newSession
        ]);
    }

    public function getThisUserSessionsState($state){
        // get the current user
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return response()->json(['error' => 'INVALID_TOKEN'], 401);
        }

        return $this->getUserSessionsState($user->id, $state);
    }

    /**
     * @param $uid User id
     * @param $state GameSession state for sessions in question ['open', 'future', 'past', 'now', 'all']
     * @return mixed List of GameSessions
     */
    public function getUserSessionsState($uid, $state){
        $q = GameSession::whereHas('users', function($subQuery) use ($uid){
            $subQuery->where('users.id', '=', $uid);
        });
        $q = Helpers::withOffsets($q);

        switch ($state) {
            case 'open':
                // sessions where start time is in the future and max_players !== users.count
                $sessions = $q->where('start_time', '>', Carbon::now())->orderBy('start_time')->get()
                    ->filter(function ($s) {
                        return $s->game->max_players > sizeof($s->users);
                    });
                break;
            case 'future':
                // sessions where start time is in the future
                $sessions = $q->where('start_time', '>', Carbon::now())->orderBy('start_time')->get();
                break;
            case 'past':
                // sessions where end time is in the past
                $sessions = $q->where('end_time', '<', Carbon::now())->orderBy('start_time')->get();
                break;
            case 'now':
                // sessions where end time is in the future and start time is in the past
                $sessions = $q->where('start_time', '<', Carbon::now())
                    ->where('end_time', '>', Carbon::now())->orderBy('start_time')->get();
                break;
            case 'all':
                $sessions = $q->get();
                break;
            default:
                return response()->json([
                    'error' => "INVALID_SESSION_STATE",
                ], 400);
        }

        // return values
        if (isset($sessions) && sizeof($sessions)) {
            return response()->json([
                'sessions' => $sessions,
            ]);
        }
        return response()->json([
            'error' => "NO_SESSIONS_FOUND",
        ], 404);
    }
}
