<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];
    use SoftDeletes;

    public function gameCategory(){
        return $this->belongsTo('App\Models\GameCategory');
    }

    public function gameType(){
        return $this->belongsTo('App\Models\GameType');
    }

    public function publisher(){
        return $this->belongsTo('App\Models\Publisher');
    }

    public function organizations(){
        return $this->belongsToMany('App\Models\Organization', 'game_inventories')->withTimestamps()->withPivot('count');
    }

    public function gameSessions(){
        return $this->hasMany('App\Models\GameSession');
    }

    public function leagues(){
        return $this->hasManyThrough('App\Models\League', 'App\Models\GameSession');
    }



    /**
     * @param $query Game query (MUST INCLUDE game.id)
     * @return mixed
     */
    public static function simplify($query) {
        return $query->with(array('publisher' => function ($subQuery) {
            $subQuery->select('id', 'name', 'url', 'short_name', 'description');
        }))->with(array('gameType' => function ($subQuery) {
            $subQuery->select('id', 'name', 'short_name', 'description');
        }))->with(array('gameCategory' => function ($subQuery) {
            $subQuery->select('id', 'name', 'short_name', 'description');
        }));
    }
}
