<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGameSessionTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leagues', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('game_sessions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('note')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('game_id')->unsigned();
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');
            $table->integer('league_id')->unsigned()->nullable();
            $table->foreign('league_id')->references('id')->on('leagues')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });

        /* pivot tables */

        Schema::create('league_user', function (Blueprint $table){
            $table->increments('id');
            $table->integer('league_id')->unsigned()->nullable();
            $table->foreign('league_id')->references('id')->on('leagues')->onDelete('cascade');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('game_session_user', function (Blueprint $table){
            $table->increments('id');
            $table->integer('game_session_id')->unsigned()->nullable();
            $table->foreign('game_session_id')->references('id')->on('game_sessions')->onDelete('cascade');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('leagues');
        Schema::dropIfExists('game_sessions');
        Schema::dropIfExists('league_user');
        Schema::dropIfExists('game_session_user');
    }
}
