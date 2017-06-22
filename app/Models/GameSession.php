<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameSession extends Model {
    use SoftDeletes;

    protected $fillable = ['sponsor_note', 'note', 'start_time', 'end_time', 'game_id', 'league_id', 'organization_id'];
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
        return $this->belongsToMany('App\Models\User')->withTimestamps();
    }

    public function gameMessages() {
        return $this->hasMany('App\Models\GameMessage');
    }

    /**
     * Returns a query for selecting sessions by organization
     * @param $org string id or short_name of organization
     * @return mixed Query with only basic data about the session. Includes userse, leagues, and game.
     */
    public static function byOrgQuery($org) {

        return self::simplify(self::select('id', 'note', 'sponsor_note', 'start_time', 'end_time', 'game_id', 'league_id', 'id', 'organization_id')
            ->whereHas('organization', function ($subQuery) use ($org) {
                // check for short_name or id
                if (is_numeric($org))
                    $subQuery->where('id', '=', $org);
                else
                    $subQuery->where('short_name', '=', $org);
            }));
    }

    /**
     * Returns total open slots. Does not take into account whether the user is already signed up. See isSignedUp().
     * @return mixed max_players - signed up users
     */
    public function openSlots() {
        return $this->game->max_players - $this->users()->count();
    }

    /**
     * @param $uid User id
     * @return mixed 1 if the user is signed up for the session, 0 if not
     */
    public function isSignedUp($uid){
        return $this->users()->where('users.id', '=', $uid)->count();
    }

    /**
     * Returns a query for selecting sessions by League
     * @param $league string id or short_name of League
     * @return mixed Query with only basic data about the session. Includes userse, leagues, and game.
     */
    public static function byLeagueQuery($league) {

        return self::simplify(self::select('id', 'note', 'start_time', 'end_time', 'game_id', 'league_id', 'id')
            ->whereHas('league', function ($subQuery) use ($league) {
                $subQuery->where('id', '=', $league);
            }));
    }


    /**
     * @param $query GameSession query (MUST INCLUDE game_sessions.id
     * @return mixed
     */
    public static function simplify($query) {
        return $query->with(array('game' => function ($subQuery) {
            $subQuery->select('id', 'name', 'url', 'bgg_id', 'min_players', 'max_players', 'min_age', 'max_playtime_box',
                'max_playtime_actual');
        }))->with(array('league' => function ($subQuery) {
            $subQuery->select('id', 'name');
        }))->with(array('users' => function ($subQuery) {
            $subQuery->select('first_name', 'last_name', 'username');
        }));
    }
}
