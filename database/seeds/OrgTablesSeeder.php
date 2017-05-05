<?php

use Illuminate\Database\Seeder;

class OrgTablesSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        // organizations
        \App\Models\Organization::create([
            'name' => "Tea and Victory",
            'short_name' => "teaandvictory",
            'description' => "Rocky is the best.",
            'url' => "http://teaandvictory.com",
        ]);
        if (\Illuminate\Support\Facades\App::environment() !== 'production') {
            factory(App\Models\Organization::class, 5)->create();

            // inventories
            $game_ids = \DB::table('games')->pluck('id')->toArray();
            $org_ids = \DB::table('organizations')->pluck('id')->toArray();
            $users = \DB::table('users')->pluck('id')->toArray();

            foreach ($org_ids as $org) {
                for ($i = 0; $i < 50; $i++) { // this does not necessarily create 20 elements. that is intended
                    $game_id = $game_ids[array_rand($game_ids)];
                    $existing = \DB::table('game_inventories')->select('id')->where('game_id', '=', $game_id)->where('organization_id', '=', $org)->get();
                    if (!$existing->count()) {
                        \DB::table('game_inventories')->insert([
                            'organization_id' => $org,
                            'game_id' => $game_id,
                            'count' => random_int(0, 10),
                            'created_at' => \Carbon\Carbon::now(),
                            'updated_at' => \Carbon\Carbon::now()
                        ]);
                    }
                }

                // admins
                $user_id = $users[array_rand($users)];
                \DB::table("organization_admins")->insert([
                    'organization_id' => $org,
                    'user_id' => $user_id
                ]);
            }
        }

    }
}
