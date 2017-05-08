<?php

namespace App\Http\Controllers;

use App\Models\GameSession;
use App\Models\League;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;
use Carbon\Carbon;

class LeagueController extends Controller {

    /**
     * @param $league League id
     * @return \Illuminate\Http\JsonResponse Full league info
     */
    public function getLeague($league) {
        $league = League::find($league);

        // return values
        if ($league && sizeof($league)) {
            return response()->json([
                'league' => $league,
            ]);
        }
        return response()->json([
            'error' => "NO_LEAGUES_FOUND",
        ], 404);
    }


    public function deleteLeague($id) {
        // find the user
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return response()->json(['error' => 'token_invalid'], 401);
        }

        // only allow for associated user or admin
        if ($user->is_admin)
            $league = League::where('id', '=', $id)->first();
        else {
            $league = League::where('id', '=', $id)->whereHas('users', function ($subQuery) use ($user) {
                $subQuery->where('users.id', '=', $user->id);
            })->first();
        }

        if (!$league)
            return response()->json(['error' => 'NO_LEAGUES_FOUND'], 404);

        $league->delete();

        return response()->json(['success' => "LEAGUE_DELETED"]);

    }

    /**
     * @param Organization string, id, or "all"
     * @return \Illuminate\Http\JsonResponse all leagues for the specified org
     */
    public function getLeaguesByOrg($org = "all") {
        $leagues = League::whereHas('organizations', function ($query) use ($org) {
            if (is_numeric($org))
                $query->where('organizations.id', '=', $org);
            else if ($org === "all")
                return true;
            else
                $query->where('short_name', '=', $org);
        })->select('leagues.id', 'name', 'created_at')->get();

        // return values
        if ($leagues && sizeof($leagues)) {
            return response()->json([
                'leagues' => $leagues,
            ]);
        }
        return response()->json([
            'error' => "NO_LEAGUES_FOUND",
        ], 404);
    }

    /**
     * @param $league string id or short_name of Organization
     * @param $state Status of the sessions in question ['open', 'future', 'past', 'now', 'all']
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLeagueSessionsState($league, $state) {
        $q = GameSession::byLeagueQuery($league);
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
