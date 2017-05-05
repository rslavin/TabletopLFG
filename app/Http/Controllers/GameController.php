<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameInventory;
use App\Models\Organization;

class GameController extends Controller {
    /**
     * Returns list of games
     *
     * @param null $org short_name of organization
     * @return \Illuminate\Http\JsonResponse JSON object of games
     */
//    public function getGames($org = null) {
//        // get query for either specific organization or all
//        if (!$org) {
//            $gamesQ = Game::whereNotNull('id');
//        } else if (is_numeric($org)) {
//            $gamesQ = Game::whereHas('organizations', function ($subQuery) use ($org) {
//                $subQuery->where('organizations.id', '=', $org)
//                    ->where('game_inventories.count', '>', 0);
//            });
//        } else {
//            $gamesQ = Game::whereHas('organizations', function ($subQuery) use ($org) {
//                $subQuery->where('organizations.short_name', '=', $org)
//                    ->where('game_inventories.count', '>', 0);
//            });
//        }
//        // todo figure out how to eager load the pivot
//
//        $games = Game::simplify($gamesQ->with('publisher')->with('gameType'))->get();
//        if ($games && sizeof($games)) {
//            return response()->json([
//                'games' => $games,
//            ]);
//        }
//        return response()->json([
//            'error' => "NO_GAMES_FOUND",
//        ], 404);
//    }

    public function getGames($org = null) {

        // if org, find it first to minimize queries
        if ($org) {
            if (is_numeric($org))
                $o = Organization::find($org);
            else
                $o = Organization::where('short_name', '=', $org)->first();

            // this doesn't seem ideal, but Laravel doesn't eager load pivots
            if ($o && sizeof($o)) {
                $inv = GameInventory::where('organization_id', '=', $o->id)
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
            }
        } else {
            $games = Game::simplify(Game::whereNotNull('id'))->get();
        }
        if (isset($games) && count($games)) {
            return response()->json([
                'games' => $games
            ]);
        }

        return response()->json([
            'error' => "NO_GAMES_FOUND",
        ], 404);
    }

    /**
     * Returns a single game with inventory count if $org is passed
     * @param $id id
     * @param $org org id or short name
     * @return \Illuminate\Http\JsonResponse JSON object of the game with relationships. Inventory count
     * is included if a valid $org is passed.
     */
    public function getGame($id, $org = null) {

        // if org, find it first to minimize queries
        if ($org) {
            if (is_numeric($org))
                $o = Organization::find($org);
            else
                $o = Organization::where('short_name', '=', $org)->first();

            // this doesn't seem ideal, but Laravel doesn't eager load pivots
            if ($o && sizeof($o)) {
                $inv = GameInventory::where('game_id', '=', $id)
                    ->where('organization_id', '=', $o->id)
                    ->with('game', 'game.publisher', 'game.gameType', 'game.gameCategory')->first();

                // clean up response
                if (count($inv)) {
                    $response = [
                        'game' => $inv->game,
                        'inventory' => [
                            'count' => $inv->count,
                            'updated_at' => $inv->updated_at
                        ]
                    ];
                }
            }
        } else {
            $game = Game::where('id', '=', $id)->with('publisher')->with('gameType')->with('gameCategory')->first();
            $response = [
                'game' => $game
            ];
        }
        if (isset($response)) {
            return response()->json($response);
        }

        return response()->json([
            'error' => "NO_GAMES_FOUND",
        ], 404);
    }
}
