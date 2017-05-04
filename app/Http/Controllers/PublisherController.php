<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Publisher;
use Illuminate\Http\Request;

class PublisherController extends Controller
{

    /**
     * Returns a collection of games based on a publisher
     * @param $pub id or short_name of the publisher
     * @return \Illuminate\Http\JsonResponse JSON object of the games with relationships
     */
    public function getGamesByPublisher($pub) {
        $games = Game::whereHas('publisher', function ($subQuery) use ($pub) {
            if (is_numeric($pub))
                $subQuery->where('id', '=', $pub);
            else
                $subQuery->where('short_name', '=', $pub);
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
     * Returns information about a single publisher
     * @param $pub id or short_name of the publisher
     * @return \Illuminate\Http\JsonResponse JSON object of the publisher
     */
    public function getPublisher($pub) {
        if (is_numeric($pub))
            $p = Publisher::find($pub);
        else
            $p = Publisher::where('short_name', '=', $pub)->first();

        if ($p && sizeof($p)) {
            return response()->json([
                'publisher' => $p,
            ]);
        }
        return response()->json([
            'error' => "NO_PUBS_FOUND",
        ], 404);
    }

}
