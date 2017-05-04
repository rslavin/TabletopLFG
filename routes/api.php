<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// admin-only routes
Route::group(['prefix' => 'admin'], function (){
    Route::get('games', function (){

    })->name('adminGames');
});
// TODO: implement the admin middlewar and move these routes into it

// routes requiring a login first
Route::group(['middleware' => 'auth'], function (){

});
// TODO: implement the auth middleware and move these routes into it

/** guest routes **/
// games
Route::get('games', 'GameController@getGames');
Route::get('game/{id}', 'GameController@getGame');
Route::get('publisher/{id}', 'PublisherController@getPublisher');
Route::get('publisher/{id}/games', 'PublisherController@getGamesByPublisher');
Route::get('gametype/{id}', 'GameTypeController@getType');
Route::get('gametype/{id}/games', 'GameTypeController@getGamesByType');
Route::get('gamecat/{id}', 'GameCategoryController@getCategory');
Route::get('gamecat/{id}/games', 'GameCategoryController@getGamesByCategory');

// leagues/sessions
Route::get('sessions/{org}', 'GameSessionController@getOrgSessions');
Route::get('sessions/{org}/state/{state}', 'GameSessionController@getOrgSessionsState'); // state : future, past, open (future)
Route::get('sessions/{org}/find/{query}/{onlyOpen?}', 'GameSessionController@getOrgSessionsQuery'); // search by game, league, etc
Route::get('league/{league}', 'LeagueController@getLeague');
Route::get('league/{league}/state/{state}', 'LeagueController@getLeagueSessionsState');
Route::get('league/{org}/find/{query}/{onlyOpen?}', 'LeagueController@getLeagueSessionsQuery'); // search by game, org, etc
