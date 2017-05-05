<?php

namespace App\Http\Controllers;

use App\Models\GameSession;
use Carbon\Carbon;

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
        $q = GameSession::byOrgQuery($org);
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
            ->whereHas('game', function($subQuery) use($sessionQuery){
                $subQuery->where('name', 'like', "%$sessionQuery%");
            });

        $sessionsByLeague = GameSession::byOrgQuery($org)
            ->where('end_time', '>', Carbon::now())
            ->whereHas('league', function($subQuery) use($sessionQuery){
                $subQuery->where('name', 'like', "%$sessionQuery%");
            });

        $sessionsByNotes = GameSession::byOrgQuery($org)
            ->where('end_time', '>', Carbon::now())
            ->where('note', 'like', "%$sessionQuery%");

        $union = $sessionsByGame->union($sessionsByNotes)->union($sessionsByLeague)
            ->orderBy('start_time');

        // include or exclude sessions without open slots
        if($openOnly){
            $sessions = $union->get()->filter(function ($s) {
                return $s->game->max_players > sizeof($s->users);
            });
        }else{
            $sessions = $union->get();

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
