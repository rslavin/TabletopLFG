<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BggCache extends Model
{
    protected $table = 'bgg_cache';
    protected $guarded = ['id'];
    protected $dates = ['created_at', 'updated_at'];

}
