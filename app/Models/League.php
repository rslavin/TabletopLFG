<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class League extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    public function gameSessions(){
        return $this->hasMany('App\Models\GameSession');
    }

    public function users(){
        return $this->belongsToMany('App\Models\User')->withTimestamps();
    }

    public function games(){
        return $this->belongsToMany('App\Models\Game', 'game_sessions');
    }

    public function organizations(){
        return $this->belongsToMany('App\Models\Organization', 'game_sessions');
    }
}
