<?php

namespace App\Http\Controllers;

use App\Utils\Helpers;
use App\Models\Game;
use App\Models\GameInventory;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller {

    public function __construct() {
        $this->middleware('jwt.admin')->only(['postCreateGame', 'postAssociateGameToOrg', 'deleteGame']);
    }

    public function getGames($org = null) {
        // if org, find it first to minimize queries
        if ($org) {
            if (is_numeric($org))
                $o = Organization::find($org);
            else
                $o = Organization::where('short_name', '=', $org)->first();

            // this doesn't seem ideal, but Laravel doesn't eager load pivots
            if ($o && sizeof($o)) {
                $inv = Helpers::withOffsets(GameInventory::where('organization_id', '=', $o->id)
                    ->with('game', 'game.publisher', 'game.gameType', 'game.gameCategory'))->get();

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
            $games = Helpers::withOffsets(Game::simplify(Game::whereNotNull('id')))->get();
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

    /**
     * Creates a new game
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse The created game
     */
    public function postCreateGame(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:games,name',
            'description' => 'required|string|max:255',
            'url' => 'url|max:255',
            'min_players' => 'required|min:1|integer',
            'max_players' => 'required|max:100|greater_than_field:min_players|integer',
            'min_age' => 'integer|max:100',
            'max_playtime_box' => 'string|max:32',
            'max_playtime_actual' => 'string|max:32',
            'year_published' => 'integer|max:2100',
            'footprint_width_inches' => 'integer|max:255',
            'footprint_height_inches' => 'integer|max:255',
            'footprint_length_inches' => 'integer|max:255',
            'game_type_id' => 'exists:game_types,id',
            'publisher_id' => 'exists:publishers,id',
            'game_category_id' => 'exists:game_categories,id'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        $g = Game::create(Input::all());
        return response()->json(['game' => $g]);
    }

    /**
     * Creates or updates a GameInventory record for an Organization
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAssociateGameToOrg(Request $request) {
        $validator = Validator::make($request->all(), [
            'game_id' => 'required|exists:games,id',
            'organization_id' => 'required|exists:organizations,id',
            'count' => 'required|integer|max:255'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        $inv = GameInventory::updateOrCreate([
            'game_id' => Input::get('game_id'),
            'organization_id' => Input::get('organization_id')
        ], ['count' => Input::get('count')]);

        return response()->json(['inventory' => $inv]);
    }

    public function deleteGame($id){
        if(!$g = Game::find($id))
            return response()->json(['error' => 'NO_GAME_FOUND']);

        $g->delete();
        return response()->json(['success' => 'GAME_DELETED']);
    }
}
