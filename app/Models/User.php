<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use JWTAuth;

class User extends Authenticatable {
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'email'
    ];

    public function gameSessions() {
        return $this->belongsToMany('App\Model\GameSession');
    }

    public function leagues() {
        return $this->belongsToMany('App\Model\League');
    }

    public function adminOrganizations() {
        return $this->belongsToMany('App\Model\Organization', 'organization_admins');
    }
}
