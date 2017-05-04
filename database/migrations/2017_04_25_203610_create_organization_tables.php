<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrganizationTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        // update game_sessions to reference organizations
        Schema::table('game_sessions', function(Blueprint $table){
            $table->integer('organization_id')->unsigned();
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
        });

        Schema::create('organization_admins', function(Blueprint $table){
            $table->increments('id');
            $table->integer('organization_id')->unsigned()->nullable();
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('game_inventories', function(Blueprint $table){
            $table->integer('organization_id')->unsigned();
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('game_inventories', function(Blueprint $table){
            $table->dropForeign('game_inventories_organization_id_foreign');
            $table->dropColumn('organization_id');
        });
        Schema::table('game_sessions', function(Blueprint $table){
            $table->dropForeign('game_sessions_organization_id_foreign');
            $table->dropColumn('organization_id');
        });
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('organization_admins');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
