<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameInventory;
use App\Models\Organization;
use App\Models\Publisher;
use App\Utils\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class PublisherController extends Controller {

    public function __construct() {
        $this->middleware('jwt.admin')->only('deletePublisher', 'updatePublisher');
    }

    public function deletePublisher($id) {
        // Use JwtAdmin middleware
        if (is_numeric($id))
            $t = Publisher::find($id);
        else
            $t = Publisher::where('short_name', '=', $id)->first();

        if ($t)
            $t->delete();
        else
            return response()->json(['error' => "NO_PUBLISHERS_FOUND"], 404);

        return response()->json(['success' => "PUBLISHER_DELETED"]);
    }

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

    /**
     * Creates a new publisher
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCreatePublisher(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:190|unique:publishers,name',
            'short_name' => 'required|string|max:64|regex:/^[\pL\s\d\-]+$/u|unique:publishers,short_name',
            'description' => 'required|string|max:2055',
            'url' => 'url|max:190'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        if (Input::get('itemId') != null) {
            $pub = Publisher::find(Input::get('itemId'));
            if (!$pub)
                return response()->json(['error' => 'PUBLISHER_NOT_FOUND']);
            $pub->update(Input::only([
                'name',
                'description',
                'url',
                'short_name'
            ]));
        } else {
            $pub = Publisher::create(Input::all());
        }

        return response()->json(['publisher' => $pub]);
    }

    public function undeletePublisher($id) {
        if ($g = Publisher::withTrashed()->where('id', '=', $id)->restore())
            return response()->json(['success' => 'PUBLISHER_UNDELETED']);
        return response()->json(['error' => 'PUBLISHER_NOT_FOUND']);
    }

    /**
     * Updates the Publisher
     * @param Request $request
     * @param $id Publisher id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePublisher(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:190',
            'short_name' => 'required|string|max:64|regex:/^[\pL\s\d\-]+$/u',
            'description' => 'required|string|max:2055',
            'url' => 'url|max:190'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        $cat = Publisher::find($id);
        if (!$cat)
            return response()->json(['error' => 'PUBLISHER_NOT_FOUND'], 404);

        // check for unique fields
        if(Publisher::where('short_name', '=', Input::get('short_name'))->where('id', '!=', $id)->count())
            return response()->json(['error' => ['short_name' => 'Duplicate short name']], 200);
        if(Publisher::where('name', '=', Input::get('name'))->where('id', '!=', $id)->count())
            return response()->json(['error' => ['short_name' => 'Duplicate name']], 200);

        $cat->update(Input::only(['name', 'short_name', 'description', 'url']));
        return response()->json(['success' => 'PUBLISHER_UPDATED']);
    }

    public function getPublishers() {
        return response()->json(['publishers' => Publisher::whereNotNull('name')->orderBy('name')->get()]);
    }
}
