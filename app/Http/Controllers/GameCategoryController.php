<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameCategory;

class GameCategoryController extends Controller
{
    /**
     * Returns a collection of games based on a game category
     * @param $category id or short_name of the game category
     * @return \Illuminate\Http\JsonResponse JSON object of the games with relationships
     */
    public function getGamesByCategory($category) {
        $games = Game::whereHas('gameCategory', function ($subQuery) use ($category) {
            if (is_numeric($category))
                $subQuery->where('id', '=', $category);
            else
                $subQuery->where('short_name', '=', $category);
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
     * Returns information about a single game category
     * @param $cat id or short_name of the game category
     * @return \Illuminate\Http\JsonResponse JSON object of the game category
     */
    public function getCategory($cat) {
        if (is_numeric($cat))
            $c = GameCategory::find($cat);
        else
            $c = GameCategory::where('short_name', '=', $cat)->first();

        if ($c && sizeof($c)) {
            return response()->json([
                'game_category' => $c,
            ]);
        }
        return response()->json([
            'error' => "NO_CATEGORIES_FOUND",
        ], 404);
    }
}
