<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGameTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('type')->nullable(); // is this a reference to a table?
            $table->integer('min_players')->nullable();
            $table->integer('max_players')->nullable();
            $table->integer('recagemin')->nullable(); // what is this?
            $table->integer('publisher')->nullable(); // reference to a table?
            $table->integer('family')->nullable(); // boolean?
            $table->integer('max_playtime_box')->nullable();
            $table->integer('playtime_tv')->nullable();
            $table->integer('year_published')->nullable(); // is there a reason this is an int and not a smallint (goes for most of these)?
            $table->integer('footprint_width')->nullable();
            $table->integer('footprint_length')->nullable();
            $table->timestamps();
        });

        Schema::create('game_inventories', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('game_id')->unsigned();
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');
            $table->integer('count')->default(0);
            $table->timestamps(); // was lastmaintained
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('games');
        Schema::dropIfExists('game_inventories');
    }
}
