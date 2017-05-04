<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publisher extends Model
{
    protected $guarded = ['id'];
    protected $dates = ['created_at', 'updated_at'];

    public function games(){
        return $this->hasMany('App\Models\Game');
    }
}
