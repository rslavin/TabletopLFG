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

// routes requiring a login first
Route::group(['middleware' => 'auth'], function (){

});

// guest routes