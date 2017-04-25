<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameSession extends Model
{
    use SoftDeletes;

    protected $fillable = ['note', 'start_time', 'end_time', 'game_id', 'league_id', 'organization_id'];
    protected $dates = ['start_time', 'end_time', 'created_at', 'updated_at', 'deleted_at'];

    public function game(){
        return $this->belongsTo('App\Models\Game');
    }

    public function league(){
        return $this->belongsTo('App\Models\League');
    }

    public function organization(){
        return $this->belongsTo('App\Models\Organization');
    }

    // softdeletes may not work on the pivot table.
    // if you want it to work, turn the pivot into a model
    public function users(){
        return $this->belongsToMany('App\Models\User');
    }
}
