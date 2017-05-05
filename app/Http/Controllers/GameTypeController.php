<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameInventory;
use App\Models\GameType;
use App\Models\Organization;
use App\Utils\Helpers;

class GameTypeController extends Controller
{
    /**
     * @param $type Gametype short_name or id
     * @param null $org Organization short_name or id
     * @return \Illuminate\Http\JsonResponse JSON object of games and type. Inventory included if valid $org is passed
     */
    public function getGamesByType($type, $org = null) {
        // if org, find it first to minimize queries
        if ($org) {
            if (is_numeric($org))
                $o = Organization::find($org);
            else
                $o = Organization::where('short_name', '=', $org)->first();

            // this doesn't seem ideal, but Laravel doesn't eager load pivots
            if ($o && sizeof($o)) {
                $inv = Helpers::withOffsets(GameInventory::where('organization_id', '=', $o->id)
                    ->whereHas('game', function ($subQuery) use ($type) {
                        $subQuery->whereHas('gameType', function ($ssubQuery) use ($type) {
                            if (is_numeric($type)) {
                                $ssubQuery->where('game_types.id', '=', $type);
                            } else {
                                $ssubQuery->where('game_types.short_name', '=', $type);
                            }
                        });
                    }))
                    ->with('game', 'game.publisher', 'game.gameType', 'game.gameCategory')->get();

                // clean up
                $games = array();
                foreach ($inv as $i) {
                    array_push($games, [
                        'game' => $i->game,
                        'inventory' => [
                            'count' => $i->count,
                            'updated_at' => $i->updated_at
                        ]
                    ]);
                }

                if (count($games)) {
                    // return game and org info
                    $response = [
                        'game_type' => $inv[0]->game->gameType,
                        'games' => $games,
                    ];
                }
            }
        } else {
            // no org
            $games = Helpers::withOffsets(Game::whereHas('gameType', function ($ssubQuery) use ($type) {
                if (is_numeric($type)) {
                    $ssubQuery->where('game_types.id', '=', $type);
                } else {
                    $ssubQuery->where('game_types.short_name', '=', $type);
                }
            }))->with('publisher', 'gameType', 'gameCategory')->get();

            if (count($games)) {
                $response = [
                    'game_type' => $games[0]->gameType,
                    'games' => $games
                ];
            }
        }
        if (isset($response)) {
            return response()->json($response);
        }

        return response()->json([
            'error' => "NO_GAMES_FOUND",
        ], 404);
    }

    /**
     * Returns information about a single game type
     * @param $type id or short_name of the game type
     * @return \Illuminate\Http\JsonResponse JSON object of the game type
     */
    public function getType($type) {
        if (is_numeric($type))
            $t = GameType::find($type);
        else
            $t = GameType::where('short_name', '=', $type)->first();

        if ($t && sizeof($t)) {
            return response()->json([
                'game_type' => $t,
            ]);
        }
        return response()->json([
            'error' => "NO_TYPES_FOUND",
        ], 404);
    }
}
