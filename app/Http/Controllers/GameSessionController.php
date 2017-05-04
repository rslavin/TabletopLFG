<?php

namespace App\Http\Controllers;

use App\Models\GameSession;
use Carbon\Carbon;

class GameSessionController extends Controller
{
    /**
     * @param $org id or short_name of Organization
     * @return \Illuminate\Http\JsonResponse Sessions for the Organization
     */
    public function getOrgSessions($org){
        $sessions = GameSession::byOrgQuery($org)->get();

        // return values
        if ($sessions && sizeof($sessions)) {
            return response()->json([
                'sessions' => $sessions,
            ]);
        }
        return response()->json([
            'error' => "NO_SESSIONS_FOUND",
        ], 404);
    }

    /**
     * @param $org string id or short_name of Organization
     * @param $state Status of the sessions in question ['open', 'future', 'past', 'now']
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrgSessionsState($org, $state){
        $q = GameSession::byOrgQuery($org);
        switch ($state){
            case 'open':
                // sessions where start time is in the future and max_players !== users.count
                $sessions = $q->where('start_time', '>', Carbon::now())->orderBy('start_time')->get()
                ->filter(function($s){
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
