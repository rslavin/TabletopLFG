<?php

use Illuminate\Database\Seeder;

class UserTablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // admins
        \DB::table('users')->insert([
            'first_name' => 'Rocky',
            'last_name' => 'Slavin',
            'email' => 'rocky.slavin@gmail.com',
            'username' => 'rslavin',
            'password' => bcrypt("tabletop123"),
            'verified' => '1',
            'is_admin' => '1',
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now(),
        ]);

        if (\Illuminate\Support\Facades\App::environment() !== 'production') {
            // test users
            factory(App\Models\User::class, 50)->create();
        }
    }
}
