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
        return $this->hasMany('App\Model\GameSession');
    }

    public function users(){
        return $this->belongsToMany('App\Model\User');
    }

    public function games(){
        return $this->belongsToMany('App\Model\Game', 'App\Model\GameSession');
    }

    public function organizations(){
        return $this->belongsToMany('App\Model\Organization', 'App\Model\GameSession');
    }
}
