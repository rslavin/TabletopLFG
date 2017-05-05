<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameInventory;
use App\Models\Organization;
use App\Models\Publisher;
use App\Utils\Helpers;

class PublisherController extends Controller {

    /**
     * Returns a collection of games based on a publisher
     * @param $pub id or short_name of the publisher
     * @param null $org
     * @return \Illuminate\Http\JsonResponse JSON object of the games with relationships
     */
    public function getGamesByPublisher($pub, $org = null) {

        // if org, find it first to minimize queries
        if ($org) {
            if (is_numeric($org))
                $o = Organization::find($org);
            else
                $o = Organization::where('short_name', '=', $org)->first();

            // this doesn't seem ideal, but Laravel doesn't eager load pivots
            if ($o && sizeof($o)) {
                $inv = Helpers::withOffsets(GameInventory::where('organization_id', '=', $o->id)
                    ->whereHas('game', function ($subQuery) use ($pub) {
                        $subQuery->whereHas('publisher', function ($ssubQuery) use ($pub) {
                            if (is_numeric($pub)) {
                                $ssubQuery->where('publishers.id', '=', $pub);
                            } else {
                                $ssubQuery->where('publishers.short_name', '=', $pub);
                            }
                        });
                    }))
                    ->with('game', 'game.gameType', 'game.gameCategory')->get();

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
                        'publisher' => $inv[0]->game->publisher,
                        'games' => $games,
                    ];
                }
            }
        } else {
            // no org
            $games = Helpers::withOffsets(Game::whereHas('publisher', function ($ssubQuery) use ($pub) {
                if (is_numeric($pub)) {
                    $ssubQuery->where('publishers.id', '=', $pub);
                } else {
                    $ssubQuery->where('publishers.short_name', '=', $pub);
                }
            }))->with('publisher', 'gameType', 'gameCategory')->get();

            if (count($games)) {
                $response = [
                    'publisher' => $games[0]->publisher,
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
