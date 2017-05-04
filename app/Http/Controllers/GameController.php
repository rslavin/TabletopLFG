<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameCategory;
use App\Models\GameType;
use App\Models\Publisher;

class GameController extends Controller {
    /**
     * Returns list of games
     *
     * @param null $org short_name of organization
     * @return \Illuminate\Http\JsonResponse JSON object of games
     */
    public function getGames($org = null) {
        // get query for either specific organization or all
        if ($org) {
            $gamesQ = Game::whereHas('organizations', function ($subQuery) use ($org) {
                $subQuery->where('organizations.short_name', '=', $org);
            });
        } else {
            $gamesQ = Game::whereNotNull('id');
        }

        $games = $gamesQ->with('publisher')->with('gameType')->with('gameCategory')->get();
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
    public function getGame($id) {
        $game = Game::where('id', '=', $id)->with('publisher')->with('gameType')->with('gameCategory')->first();
        if ($game && sizeof($game)) {
            return response()->json([
                'game' => $game,
            ]);
        }
        return response()->json([
            'error' => "NO_GAMES_FOUND",
        ], 404);
    }




}
