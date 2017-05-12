<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameCategory;
use App\Models\GameInventory;
use App\Models\Organization;
use App\Utils\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class GameCategoryController extends Controller
{
    public function __construct(){
        $this->middleware('jwt.admin')->only(['deleteCategory', 'postCreateCategory', 'updateCategory']);
    }

    public function deleteCategory($id) {
        // Use JwtAdmin middleware
        if (is_numeric($id))
            $c = GameCategory::find($id);
        else
            $c = GameCategory::where('short_name', '=', $id)->first();

        if($c)
            $c->delete();
        else
            return response()->json(['error' => "NO_CATEGORIES_FOUND"], 404);

        return response()->json(['success' => "LEAGUE_DELETED"]);
    }

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
                $inv = Helpers::withOffsets(GameInventory::where('organization_id', '=', $o->id)
                    ->whereHas('game', function ($subQuery) use ($category) {
                        $subQuery->whereHas('gameCategory', function ($ssubQuery) use ($category) {
                            if (is_numeric($category)) {
                                $ssubQuery->where('game_categories.id', '=', $category);
                            } else {
                                $ssubQuery->where('game_categories.short_name', '=', $category);
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
                        'game_category' => $inv[0]->game->gameCategory,
                        'games' => $games,
                    ];
                }
            }
        } else {
            // no org
            $games = Helpers::withOffsets(Game::whereHas('gameCategory', function ($ssubQuery) use ($category) {
                if (is_numeric($category)) {
                    $ssubQuery->where('game_categories.id', '=', $category);
                } else {
                    $ssubQuery->where('game_categories.short_name', '=', $category);
                }
            }))->with('publisher', 'gameType', 'gameCategory')->get();

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

    /**
     * Creates a new GameCategory.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse Resulting category
     */
    public function postCreateCategory(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:game_categories,name',
            'short_name' => 'required|string|max:255|regex:/^[\pL\s\d\-]+$/u|unique:game_categories,short_name',
            'description' => 'required|string|max:255',
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        $cat = GameCategory::create(Input::all());
        return response()->json(['game_category' => $cat]);
    }

    /**
     * Updates the GameCategory
     * @param Request $request
     * @param $id GameCategory id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCategory(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:game_categories,name',
            'short_name' => 'required|string|max:255|regex:/^[\pL\s\d\-]+$/u|unique:game_categories,short_name',
            'description' => 'required|string|max:255',
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        $cat = GameCategory::find($id);
        if(!$cat)
            return response()->json(['error' => 'GAME_CATEGORY_NOT_FOUND'], 404);

        $cat->update(Input::only(['name', 'short_name', 'description']));
        return response()->json(['success' => 'GAME_CATEGORY_UPDATED']);
    }
}
