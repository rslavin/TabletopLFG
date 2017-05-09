<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    public function gameSessions(){
        return $this->hasMany('App\Model\GameSession');
    }

    public function admins(){
        return $this->belongsToMany('App\Model\User', 'organization_admins');
    }

    public function games(){
        return $this->belongsToMany('App\Model\Game', 'game_inventories')->withTimestamps()->withPivot('count');
    }

    public function leagues(){
        return $this->belongsToMany('App\Model\League', 'game_sessions');
    }

}
