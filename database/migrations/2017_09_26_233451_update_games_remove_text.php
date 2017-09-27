<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateGamesRemoveText extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        if (Schema::hasColumn('game_sessions', 'game_text')) {
            Schema::table('game_sessions', function (Blueprint $table) {
                $table->dropColumn('game_text');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('game_sessions', function (Blueprint $table) {
            $table->string('game_text', 256)->nullable();
        });
    }
}
