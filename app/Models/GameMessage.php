<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameMessage extends Model {
    use SoftDeletes;

    protected $fillable = ['message', 'sent_date_time'];
    protected $dates = [ 'sent_date_time'];

    public function gameSession() {
        return $this->belongsTo('App\Models\GameSession');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }


}