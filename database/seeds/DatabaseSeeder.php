<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $this->call(UserTablesSeeder::class);
        if (\Illuminate\Support\Facades\App::environment() !== 'production')
            $this->call(GameTablesSeeder::class);
        $this->call(OrgTablesSeeder::class);
        if (\Illuminate\Support\Facades\App::environment() !== 'production')
            $this->call(SessionTablesSeeder::class);
    }
}
