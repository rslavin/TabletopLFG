<?php

namespace App\Utils;


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
}