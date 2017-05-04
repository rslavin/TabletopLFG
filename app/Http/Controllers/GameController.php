<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller {
    /**
     * Returns list of games
     *
     * @param null $org short_name of organization
     * @return \Illuminate\Http\JsonResponse JSON object of games
     */
    public function getGames($org = null) {
        if ($org) {
            $games = Game::whereHas('organizations', function ($subQuery) use ($org) {
                $subQuery->where('organizations.short_name', '=', $org);
            })->get();
        } else {
            $games = Game::all();
        }

        return response()->json([
            'games' => $games->toJson()
        ]);
    }
}
