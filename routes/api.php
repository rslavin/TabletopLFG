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

/** ADMIN ROUTES */
Route::group(['prefix' => 'admin'], function (){
    Route::get('games', function (){

    })->name('adminGames');
});
// TODO: implement the admin middleware and move these routes into it

/** ROUTES REQUIRING LOGIN **/
Route::group(['middleware' => 'auth'], function (){

});
// TODO: implement the auth middleware and move these routes into it

/** UNFILTERED ROUTES **/
// games
Route::get('games/{org?}', 'GameController@getGames');
Route::get('game/{id}/{org?}', 'GameController@getGame');
Route::get('publisher/{id}', 'PublisherController@getPublisher');
Route::get('publisher/{id}/{org?}', 'PublisherController@getGamesByPublisher');
Route::get('gametype/{id}', 'GameTypeController@getType');
Route::get('gametype/{id}/{org?}', 'GameTypeController@getGamesByType');
Route::get('gamecat/{id}', 'GameCategoryController@getCategory');
Route::get('gamecat/{id}/{org?}', 'GameCategoryController@getGamesByCategory');

// leagues/sessions
Route::get('sessions/{org}', 'GameSessionController@getOrgSessions');
Route::get('sessions/{org}/{state}', 'GameSessionController@getOrgSessionsState'); // state : future, past, open (future)
Route::get('sessions/{org}/search/{query}/{onlyOpen?}', 'GameSessionController@getOrgSessionsQuery'); // search by game, league, etc
Route::get('leagues/{org}', 'LeagueController@getLeaguesByOrg');
Route::get('league/{league}', 'LeagueController@getLeague');
Route::get('league/{league}/{state}', 'LeagueController@getLeagueSessionsState');
//Route::get('league/{org}/find/{query}/{onlyOpen?}', 'LeagueController@getLeagueSessionsQuery'); // No good use cases
