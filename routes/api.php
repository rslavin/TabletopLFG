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

/** ADMIN **/
Route::group(['prefix' => 'admin', 'middleware' => 'jwt.admin'], function (){
    Route::get('games', function (){
    })->name('adminGames');
});

// user
Route::post('user/session/{id}', 'GameSessionController@postSignUp');
Route::delete('user/session/{id}', 'GameSessionController@postSignUp'); // TODO if last user, delete entire session
Route::post('user/league/{id}', 'GameSessionController@postSignUp'); // TODO
Route::delete('user/session/{id}', 'GameSessionController@postSignUp'); // TODO
Route::get('user/sessions/{state}', 'GameSessionController@getThisUserSessionsState');

// auth
Route::post('register', 'Auth\TokenAuthController@register');
Route::post('authenticate', 'Auth\TokenAuthController@authenticate');
Route::delete('authenticate', 'Auth\TokenAuthController@invalidateToken');
Route::get('authenticate/user', 'Auth\TokenAuthController@getAuthenticatedUser');

// games
Route::get('games/{org?}', 'GameController@getGames');
Route::get('game/{id}/{org?}', 'GameController@getGame');
Route::post('game', 'GameController@postCreateGame'); // TODO this should cover adding a new game to an org, too
Route::put('game/{id}', 'GameController@updateGame'); // TODO
Route::delete('game/{id}', 'GameController@deleteGame'); // TODO

// publishers
Route::get('publisher/{id}', 'PublisherController@getPublisher');
Route::post('publisher', 'PublisherController@postCreatePublisher'); // TODO
Route::put('publisher/{id}', 'PublisherController@updatePublisher'); // TODO
Route::delete('publisher/{id}', 'PublisherController@deletePublisher');
Route::get('publisher/{id}/games/{org?}', 'PublisherController@getGamesByPublisher');

// game types
Route::get('gametype/{id}', 'GameTypeController@getType');
Route::post('gametype', 'GameTypeController@postCreateType'); // TODO
Route::put('gametype/{id}', 'GameTypeController@updateType'); // TODO
Route::delete('gametype/{id}', 'GameTypeController@deleteType');
Route::get('gametype/{id}/games/{org?}', 'GameTypeController@getGamesByType');

// game categories
Route::get('gamecat/{id}', 'GameCategoryController@getCategory');
Route::post('gamecat', 'GameCategoryController@postCreateCategory'); // TODO
Route::put('gamecat/{id}', 'GameCategoryController@updateCategory'); // TODO
Route::delete('gamecat/{id}', 'GameCategoryController@deleteCategory');
Route::get('gamecat/{id}/games/{org?}', 'GameCategoryController@getGamesByCategory');

// game sessions
Route::get('session/{id}', 'GameSessionController@getSession');
Route::post('session', 'GameSessionController@postCreateSession');
Route::put('session/{id}', 'GameSessionController@updateSession'); // TODO
//Route::delete('session/{id}', 'GameSessionController@deleteSession'); // only delete if last user leaves
Route::get('sessions/org/{org}', 'GameSessionController@getOrgSessions');
Route::get('sessions/org/{org}/{state}', 'GameSessionController@getOrgSessionsState'); // state : future, past, open (future)
Route::get('sessions/org/{org}/search/{query}/{onlyOpen?}', 'GameSessionController@getOrgSessionsQuery'); // search by game, league, etc
Route::get('sessions/user/{uid}/{state}', 'GameSessionController@getUserSessionsState');

// leagues
Route::get('leagues/org/{org}', 'LeagueController@getLeaguesByOrg');
Route::get('leagues/user/{uid?}', 'LeagueController@getUserLeagues');
Route::get('league/{league}', 'LeagueController@getLeague');
Route::post('league', 'LeagueController@postCreateLeague');
Route::put('league/{id}', 'LeagueController@updateLeague'); // TODO
Route::delete('league/{id}', 'LeagueController@deleteLeague');
Route::get('league/{league}/{state}', 'LeagueController@getLeagueSessionsState');
//Route::get('league/{org}/find/{query}/{onlyOpen?}', 'LeagueController@getLeagueSessionsQuery'); // No good use cases
