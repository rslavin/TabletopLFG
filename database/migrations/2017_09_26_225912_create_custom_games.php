<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomGames extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_games', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('game_sessions', function (Blueprint $table) {
            $table->integer('game_id')->unsigned()->nullable()->change();
            $table->integer('custom_game_id')->unsigned()->nullable();
            $table->foreign('custom_game_id')->references('id')->on('custom_games')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('custom_games');

        Schema::table('game_sessions', function (Blueprint $table) {
            $table->integer('game_id')->unsigned();
            $table->dropForeign('game_sessions_game_id_foreign');
            $table->dropColumn('custom_game_id');
        });
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
