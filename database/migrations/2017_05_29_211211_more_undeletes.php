<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MoreUndeletes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('game_types', function(Blueprint $table){
            $table->softDeletes();
        });
        Schema::table('game_categories', function(Blueprint $table){
            $table->softDeletes();
        });
        Schema::table('publishers', function(Blueprint $table){
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
        //
        Schema::table('game_types', function(Blueprint $table){
            $table->dropColumn('deleted_at');
        });
        Schema::table('game_categories', function(Blueprint $table){
            $table->dropColumn('deleted_at');
        });
        Schema::table('publishers', function(Blueprint $table){
            $table->dropColumn('deleted_at');
        });
    }
}
