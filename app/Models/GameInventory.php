<?php

namespace App\Models;

use App\Pivots\GameInventoryPivot;
use Illuminate\Database\Eloquent\Model;

class GameInventory extends Model
{
    protected $fillable = ['game_id', 'organization_id', 'count'];
    public function game(){
        return $this->belongsTo('App\Models\Game');
    }

    public function organization(){
        return $this->belongsTo('App\Models\Organization');
    }

}
