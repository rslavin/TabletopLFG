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
        Schema::create('game_types', function (Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->string('short_name');
            $table->string('description');
            $table->timestamps();
        });

        Schema::create('game_categories', function (Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->string('short_name');
            $table->string('description');
            $table->timestamps();
        });

        Schema::create('publishers', function (Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->string('short_name');
            $table->string('description');
            $table->string('url')->nullable();
            $table->timestamps();
        });


        Schema::create('games', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->string('url')->nullable();
            $table->tinyInteger('min_players')->nullable();
            $table->tinyInteger('max_players')->nullable();
            $table->tinyInteger('min_age')->nullable();
            $table->integer('max_playtime_box')->nullable();
            $table->integer('max_playtime_actual')->nullable();
            $table->smallInteger('year_published')->nullable();
            $table->tinyInteger('footprint_width_inches')->nullable();
            $table->tinyInteger('footprint_length_inches')->nullable();
            $table->tinyInteger('footprint_height_inches')->nullable();
            $table->integer('game_type_id')->unsigned()->nullable();
            $table->foreign('game_type_id')->references('id')->on('game_types')->onDelete('set null');
            $table->integer('publisher_id')->unsigned()->nullable();
            $table->foreign('publisher_id')->references('id')->on('publishers')->onDelete('set null');
            $table->integer('game_category_id')->unsigned()->nullable();
            $table->foreign('game_category_id')->references('id')->on('game_categories')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('game_inventories', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('game_id')->unsigned();
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');
            $table->integer('count')->default(0);
            $table->timestamps(); // was lastmaintained (will use updated_at instead)
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
        Schema::dropIfExists('game_types');
        Schema::dropIfExists('game_categories');
        Schema::dropIfExists('publishers');
        Schema::dropIfExists('game_inventories');
    }
}
