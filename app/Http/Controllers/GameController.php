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
    public function getGames($org = null) {
        // get query for either specific organization or all
        if (!$org) {
            $gamesQ = Game::whereNotNull('id');
        } else if (is_numeric($org)) {
            $gamesQ = Game::whereHas('organizations', function ($subQuery) use ($org) {
                $subQuery->where('organizations.id', '=', $org)
                    ->where('game_inventories.count', '>', 0);
            });
        } else {
            $gamesQ = Game::whereHas('organizations', function ($subQuery) use ($org) {
                $subQuery->where('organizations.short_name', '=', $org)
                    ->where('game_inventories.count', '>', 0);
            });
        }
        // todo figure out how to eager load the pivot

        $games = Game::simplify($gamesQ->with('publisher')->with('gameType'))->get();
        if ($games && sizeof($games)) {
            return response()->json([
                'games' => $games,
            ]);
        }
        return response()->json([
            'error' => "NO_GAMES_FOUND",
        ], 404);
    }

    /**
     * Returns a single game
     * @param $id game_id
     * @return \Illuminate\Http\JsonResponse JSON object of the game with relationships
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

                if ($inv) {
                    // return game and org info
                    $response = [
                        'game' => $inv->game,
                        'count' => $inv->count,
                        'last_updated' => $inv->updated_at
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
