<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameType;

class GameTypeController extends Controller
{
    /**
     * Returns a collection of games based on a game type
     * @param $type id or short_name of the game type
     * @return \Illuminate\Http\JsonResponse JSON object of the games with relationships
     */
    public function getGamesByType($type) {
        $games = Game::whereHas('gameType', function ($subQuery) use ($type) {
            if (is_numeric($type))
                $subQuery->where('id', '=', $type);
            else
                $subQuery->where('short_name', '=', $type);
        })->with('publisher')->with('gameType')->with('gameCategory')->get();

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
