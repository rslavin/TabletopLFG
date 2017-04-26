<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $guarded = [
        'id', 'created_at', 'updated_at'
    ];
    protected $dates = ['created_at', 'updated_at'];

    public function organizations(){
        return $this->belongsToMany('App\Models\Organization', 'game_inventories');
    }

    public function gameSessions(){
        return $this->hasMany('App\Models\GameSession');
    }

    public function leagues(){
        return $this->hasManyThrough('App\Models\League', 'App\Models\GameSession');
    }
}