<?php

use Illuminate\Database\Seeder;

class SessionTablesSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        static $totalLeagues = 10;
        static $totalSessions = 50;

        factory(App\Models\League::class, $totalLeagues)->create();
        // fill out a few leagues
        $users = \DB::table('users')->pluck('id')->toArray();
        $leagues = \DB::table('leagues')->pluck('id')->toArray();
        // these indices only work on a fresh db. too lazy to fix it
        for ($i = 1; $i < sizeof($leagues); $i++) {
            $leagueUsers = array_rand($users, random_int(3, 10));
            for ($j = 1; $j < sizeof($leagueUsers); $j++) {
                \DB::table('league_user')->insert([
                    'league_id' => $i,
                    'user_id' => $leagueUsers[$j],
                    'created_at' => \Carbon\Carbon::now(),
                    'updated_at' => \Carbon\Carbon::now()
                ]);
            }
        }
        factory(App\Models\GameSession::class, $totalSessions)->create();
        $sessions = \DB::table('game_sessions')->pluck('id')->toArray();
        $users = \DB::table('users')->pluck('id')->toArray();
        foreach ($sessions as $session) {
            $totalUsers = random_int(1, 10);
            for ($i = 0; $i < $totalUsers; $i++) {
                // don't add the user to the same session
                $user = $users[array_rand($users)];
                $existing = \DB::table('game_session_user')->where('game_session_id', '=', $sessions[$session - 1])
                    ->where('user_id', '=', $user);
                if (!$existing->count()) {
                    \DB::table('game_session_user')->insert([
                        'game_session_id' => $sessions[$session - 1],
                        'user_id' => $user,
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now()
                    ]);
                }
            }
        }


    }
}
