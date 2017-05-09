<?php

namespace App\Utils;


use Carbon\Carbon;

class Helpers {

    /**
     * @param $q QueryBuilder
     * @return mixed QueryBuilder with "skip" and "take" added based on url parameters
     */
    public static function withOffsets($q){
        $request = request();
        // skip and take
        if($request->has('skip'))
            $q = $q->skip($request->skip);
        if($request->has('take'))
            $q = $q->take($request->take);
        return $q;
    }

    /**
     * Checks if two time periods overlap
     * @param Carbon $start1 Start of first time period
     * @param Carbon $end1 End of first time period
     * @param Carbon $start2 Start of second time period
     * @param Carbon $end2 End of second time period
     * @return bool true if there is overlap
     */
    public static function periodOverlap(Carbon $start1, Carbon $end1, Carbon $start2, Carbon $end2){
        return $start1->between($start2, $end2) || $end1->between($start2, $end2);
    }
}