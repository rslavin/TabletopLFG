<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameCategory;
use App\Models\GameInventory;
use App\Models\Organization;

class GameCategoryController extends Controller
{
    /**
     * @param $category short_name or id of GameCategory
     * @param null $org short_name or id of Organization
     * @return \Illuminate\Http\JsonResponse JSON object with games in the category.
     * Returns inventory if valid $org passed
     */
    public function getGamesByCategory($category, $org = null) {
        // if org, find it first to minimize queries
        if ($org) {
            if (is_numeric($org))
                $o = Organization::find($org);
            else
                $o = Organization::where('short_name', '=', $org)->first();

            // this doesn't seem ideal, but Laravel doesn't eager load pivots
            if ($o && sizeof($o)) {
                $inv = GameInventory::where('organization_id', '=', $o->id)
                    ->whereHas('game', function ($subQuery) use ($category) {
                        $subQuery->whereHas('gameCategory', function ($ssubQuery) use ($category) {
                            if (is_numeric($category)) {
                                $ssubQuery->where('game_categories.id', '=', $category);
                            } else {
                                $ssubQuery->where('game_categories.short_name', '=', $category);
                            }
                        });
                    })
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
                        'game_category' => $inv[0]->game->gameCategory,
                        'games' => $games,
                    ];
                }
            }
        } else {
            // no org
            $games = Game::whereHas('gameCategory', function ($ssubQuery) use ($category) {
                if (is_numeric($category)) {
                    $ssubQuery->where('game_categories.id', '=', $category);
                } else {
                    $ssubQuery->where('game_categories.short_name', '=', $category);
                }
            })->with('game', 'game.publisher', 'game.gameType', 'game.gameCategory')->get();

            if (count($games)) {
                $response = [
                    'game_category' => $games[0]->gameCategory,
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
