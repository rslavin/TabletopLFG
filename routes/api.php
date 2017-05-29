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
Route::delete('user/{id}/session/{sid}', 'GameSessionController@deleteSignupByUser'); // for admins
Route::post('user/session/{id}', 'GameSessionController@postSignUp');
Route::delete('user/session/{id}', 'GameSessionController@deleteSignUp');
Route::post('user/league/{id}', 'LeagueController@postSignUp');
Route::delete('user/league/{id}', 'LeagueController@deleteSignUp');
Route::get('user/sessions/{state}', 'GameSessionController@getThisUserSessionsState');

// auth
Route::post('register', 'Auth\TokenAuthController@register');
Route::post('authenticate', 'Auth\TokenAuthController@authenticate');
Route::delete('authenticate', 'Auth\TokenAuthController@invalidateToken');
Route::get('authenticate/user', 'Auth\TokenAuthController@getAuthenticatedUser');
Route::get('authenticate/verify/{emailToken}', 'Auth\TokenAuthController@verify');

// games
Route::get('games/{org?}', 'GameController@getGames');
Route::get('game/{id}/{org?}', 'GameController@getGame');
Route::post('game', 'GameController@postCreateGame');
Route::post('game/org', 'GameController@postAssociateGameToOrg'); // handles updating count too
Route::put('game/{id}', 'GameController@updateGame');
Route::delete('game/{id}', 'GameController@deleteGame');
Route::post('game/{id}/undelete', 'GameController@undeleteGame');

// publishers
Route::get('publisher/{id}', 'PublisherController@getPublisher');
Route::post('publisher', 'PublisherController@postCreatePublisher');
Route::put('publisher/{id}', 'PublisherController@updatePublisher');
Route::delete('publisher/{id}', 'PublisherController@deletePublisher');
Route::get('publisher/{id}/games/{org?}', 'PublisherController@getGamesByPublisher');
Route::get('publishers', 'PublisherController@getPublishers');

// game types
Route::get('gametype/{id}', 'GameTypeController@getType');
Route::post('gametype', 'GameTypeController@postCreateType');
Route::put('gametype/{id}', 'GameTypeController@updateType');
Route::delete('gametype/{id}', 'GameTypeController@deleteType');
Route::get('gametype/{id}/games/{org?}', 'GameTypeController@getGamesByType');
Route::get('gametypes', 'GameTypeController@getGameTypes');

// game categories
Route::get('gamecat/{id}', 'GameCategoryController@getCategory');
Route::post('gamecat', 'GameCategoryController@postCreateCategory');
Route::put('gamecat/{id}', 'GameCategoryController@updateCategory');
Route::delete('gamecat/{id}', 'GameCategoryController@deleteCategory');
Route::get('gamecat/{id}/games/{org?}', 'GameCategoryController@getGamesByCategory');
Route::get('gamecats', 'GameCategoryController@getGameCategories');

// game sessions
Route::get('session/{id}', 'GameSessionController@getSession');
Route::post('session', 'GameSessionController@postCreateSession');
Route::put('session/{id}', 'GameSessionController@updateSession');
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
Route::put('league/{id}', 'LeagueController@updateLeague');
Route::delete('league/{id}', 'LeagueController@deleteLeague');
Route::get('league/{league}/{state}', 'LeagueController@getLeagueSessionsState');
//Route::get('league/{org}/find/{query}/{onlyOpen?}', 'LeagueController@getLeagueSessionsQuery'); // No good use cases

// orgs
Route::get('org/{org}', 'OrganizationController@getOrg');
Route::get('orgs', 'OrganizationController@getOrgs');
