<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameMessage extends Model {
    use SoftDeletes;

    protected $fillable = ['message' ];
    protected $dates = ['created_at', 'updated_at', 'deleted at'];

    public function gameSession() {
        return $this->belongsTo('App\Models\GameSession');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }


}