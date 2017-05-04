<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameSession extends Model {
    use SoftDeletes;

    protected $fillable = ['note', 'start_time', 'end_time', 'game_id', 'league_id', 'organization_id'];
    protected $dates = ['start_time', 'end_time', 'created_at', 'updated_at', 'deleted_at'];

    public function game() {
        return $this->belongsTo('App\Models\Game');
    }

    public function league() {
        return $this->belongsTo('App\Models\League');
    }

    public function organization() {
        return $this->belongsTo('App\Models\Organization');
    }

    // softdeletes may not work on the pivot table.
    // if you want it to work, turn the pivot into a model
    public function users() {
        return $this->belongsToMany('App\Models\User');
    }

    /**
     * Returns a query for selecting sessions by organization
     * @param $org string id or short_name of organization
     * @return mixed Query with only basic data about the session. Includes userse, leagues, and game.
     */
    public static function byOrgQuery($org) {

        return self::select('id', 'note', 'start_time', 'end_time', 'game_id', 'league_id', 'id')
            ->whereHas('organization', function ($subQuery) use ($org) {
                // check for short_name or id
                if (is_numeric($org))
                    $subQuery->where('id', '=', $org);
                else
                    $subQuery->where('short_name', '=', $org);
            })->with(array('game' => function ($subQuery) {
                $subQuery->select('id', 'name', 'url', 'min_players', 'max_players', 'min_age', 'max_playtime_box',
                    'max_playtime_actual');
            }))->with(array('league' => function ($subQuery) {
                $subQuery->select('id', 'name');
            }))->with(array('users' => function ($subQuery) {
                $subQuery->select('first_name', 'last_name', 'username');
            }));
    }

    /**
     * Checks if there are slots open.
     * NOTE: if using in conjunction with byOrgQuery() or similar, it is better to
     * test the max_players/users count with those results instead of using this as a
     * filter since it will run more queries.
     * @return bool True if the game has open spots
     */
    public function isOpen(){
        return $this->game->max_players > $this->users()->count();
    }
}
