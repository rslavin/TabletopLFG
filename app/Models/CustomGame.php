<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomGame extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];
    use SoftDeletes;


    public function gameSessions(){
        return $this->hasMany('App\Models\GameSession');
    }

    public function leagues(){
        return $this->hasManyThrough('App\Models\League', 'App\Models\GameSession');
    }

}
