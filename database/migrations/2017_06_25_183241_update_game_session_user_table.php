<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateGameSessionUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('game_session_user', function(Blueprint $table){
            $table->boolean('can_teach')->default(0);
        });

        Schema::table('game_sessions', function(Blueprint $table){
            $table->string('where', 256)->nullable();
            $table->string('rules_link', 256)->nullable();
            $table->string('rules_link_domain', 16)->nullable();
            $table->string('rules_link_id', 256)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('game_session_user', function(Blueprint $table){
            $table->dropColumn('can_teach');
        });

        Schema::table('game_sessions', function(Blueprint $table){
            $table->dropColumn('where');
            $table->dropColumn('rules_link');
            $table->dropColumn('rules_link_domain');
            $table->dropColumn('rules_link_id');
        });
    }
}
