<?php

use Illuminate\Database\Seeder;

class GameTablesSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        // categories
        \App\Models\GameCategory::create([
            'name' => 'Main',
            'short_name' => 'main',
            'description' => 'Standalone, core game.'
        ]);
        \App\Models\GameCategory::create([
            'name' => 'Expansion',
            'short_name' => 'expansion',
            'description' => 'Expansion pack for a core game.'
        ]);

        // types
        \App\Models\GameType::create([
            'name' => 'Family',
            'short_name' => 'fam',
            'description' => 'Family-oriented.'
        ]);
        \App\Models\GameType::create([
            'name' => 'Strategy',
            'short_name' => 'strat',
            'description' => 'Strategy game.'
        ]);

        // publishers
        \App\Models\Publisher::create([
            'name' => 'Red Raven Games',
            'short_name' => 'redraven',
            'description' => 'Explore ancient lands, adventure through fantastical worlds, and conquer alien 
            civilizations with Red Raven’s line of imaginative, family-friendly board games.',
            'url' => 'http://redravengames.squarespace.com/'
        ]);
        \App\Models\Publisher::create([
            'name' => 'Czech Games Edition',
            'short_name' => 'cge',
            'description' => null,
            'url' => 'http://czechgames.com/'
        ]);
        \App\Models\Publisher::create([
            'name' => 'Iello Games',
            'short_name' => 'iello',
            'description' => "IELLO is a game and toy company founded in 2004 in Nancy, France. We began solely as
            a distributor, but by 2008, we began partnering with many studios to publish games as well.",
            'url' => 'http://www.iellogames.com/'
        ]);

        // games
        factory(App\Models\Game::class, 50)->create();

    }
}
