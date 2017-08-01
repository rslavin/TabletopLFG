<?php

namespace App\Http\Controllers;

use App\Models\BggCache;
use Carbon\Carbon;
use \GuzzleHttp\Exception\GuzzleException;
use \GuzzleHttp\Client;


class BoardGameGeekController extends Controller {
    private static $BGG_URL = "https://boardgamegeek.com/xmlapi/boardgame/";

    public function getGame($gameId) {
        // check if it's cached within the expiration time
        // also check that the body is good
        $cacheExp = Carbon::now()->subDays(env('BGG_EXP', 30));
        $cached = BggCache::where('bgg_id', $gameId)->first();

        if($cached && $cached->updated_at > $cacheExp) {
            $body = $cached->body;
        }else{
            // request from BGG
            $client = new Client(); //GuzzleHttp\Client
            $result = $client->request('GET', self::$BGG_URL . $gameId);

            // cache it
            $body = $result->getBody();
            if($cached) { // if already in the database (but too old), update it
                $cached->body = $body;
                $cached->save();
            }else // create a new entry
                BggCache::create(['bgg_id' => $gameId, 'body' => $body]);
        }

        return \Response::make($body, 200)->header('Content-type', 'text/xml');
    }
}
