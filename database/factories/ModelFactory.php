<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'username' => $faker->word . uniqid(),
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('tabletop123'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\Models\Game::class, function (Faker\Generator $faker) {
    $category_ids = \DB::table('game_categories')->pluck('id')->toArray();
    $category_id = $category_ids[array_rand($category_ids)];

    $type_ids = \DB::table('game_types')->pluck('id')->toArray();
    $type_id = $type_ids[array_rand($type_ids)];

    $pub_ids = \DB::table('publishers')->pluck('id')->toArray();
    $pub_id = $pub_ids[array_rand($pub_ids)];

    $minP = random_int(1, 9);
    $maxP = random_int($minP, 10);

    return [
        'name' => $faker->words(2, 1)  . uniqid() . " : the Game",
        'description' => $faker->sentences(2, 1),
        'url' => $faker->url,
        'min_players' => $minP,
        'max_players' => $maxP,
        'min_age' => random_int(1, 10),
        'max_playtime_box' => random_int(1, 10),
        'max_playtime_actual' => random_int(1, 10),
        'year_published' => $faker->year,
        'footprint_width_inches' => random_int(1, 30),
        'footprint_height_inches' => random_int(1, 30),
        'footprint_length_inches' => random_int(1, 30),
        'game_type_id' => $type_id,
        'game_category_id' => $category_id,
        'publisher_id' => $pub_id
    ];
});

$factory->define(App\Models\League::class, function (Faker\Generator $faker) {
    $name = $faker->words(2, 1);

    return [
        'name' => $name . " league",
        'created_at' => \Carbon\Carbon::now(),
        'updated_at' => \Carbon\Carbon::now(),
    ];
});

$factory->define(App\Models\Organization::class, function (Faker\Generator $faker) {
    $name = $faker->words(2, 1);

    return [
        'name' => $name . " cafe",
        'short_name' => strtolower($name),
        'description' => $faker->sentences(2, 1),
        'url' => $faker->url,
    ];
});

$factory->define(App\Models\GameSession::class, function (Faker\Generator $faker) {
    // dates
    $future = random_int(0, 1);
    $time1 = random_int(24, 1000); // distance from today
    $time2 = $time1 + random_int(1, 8); // session length
    if($future){
        $start = \Carbon\Carbon::now()->addHours($time1);
        $end = \Carbon\Carbon::now()->addHours($time2);
    }else{
        $start = \Carbon\Carbon::now()->subHours($time2);
        $end = \Carbon\Carbon::now()->subHours($time1);
    }

    // TODO add validation that the game is available
    $inv_ids = \DB::table('game_inventories')->pluck('id')->toArray();
    $inv_id = $inv_ids[array_rand($inv_ids)];
    $league_ids = \DB::table('leagues')->pluck('id')->toArray();

    $game_id = \DB::table('game_inventories')->where('id', '=', $inv_id)->pluck('game_id')[0];
    $org_id = \DB::table('game_inventories')->where('id', '=', $inv_id)->pluck('organization_id')[0];

    return [
        'note' => $faker->sentences(3, 1),
        'title' => $faker->words(4, 1),
        'start_time' => $start,
        'end_time' => $end,
        'game_id' => $game_id,
        'organization_id' => $org_id,
        'league_id' => random_int(0, 5) === 5 ? $league_ids[array_rand($league_ids)] : null,
        'created_at' => \Carbon\Carbon::now(),
        'updated_at' => \Carbon\Carbon::now(),
    ];
});


