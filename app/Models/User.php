<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $guarded = ['id', 'is_admin'];
    public function gameSessions(){
        return $this->belongsToMany('App\Model\GameSession');
    }

    public function leagues(){
        return $this->belongsToMany('App\Model\League');
    }

    public function adminOrganizations(){
        return $this->belongsToMany('App\Model\Organization', 'organization_admins');
    }
}
