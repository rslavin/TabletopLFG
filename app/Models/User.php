<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use JWTAuth;

class User extends Authenticatable {
    use Notifiable;

    public static $maxLeagues = 5;
    public static $maxSessions = 5;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'username', 'last_name', 'email', 'password', 'email_token'
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
        return $this->belongsToMany('App\Models\GameSession')->withTimestamps();
    }

    public function leagues() {
        return $this->belongsToMany('App\Models\League')->withTimestamps();
    }

    public function adminOrganizations() {
        return $this->belongsToMany('App\Models\Organization', 'organization_admins')->withTimestamps();
    }

    public function verify(){
        $this->verified = 1;
        $this->email_token = null;

        $this->save();
    }

    public static function getTokenUser(){
        try {

            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['USER_NOT_FOUND'], 404);
            }
            return $user;

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['TOKEN_EXPIRED'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['INVALID_TOKEN'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['TOKEN_MISSING'], $e->getStatusCode());

        }
    }
}
