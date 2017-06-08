<?php
/**
 * Created by PhpStorm.
 * User: jbush_000
 * Date: 6/7/2017
 * Time: 4:23 PM
 */

namespace App\Http\Controllers;

use App\Models\GameMessage;
use App\Models\GameSession;

class GameMessageController
{
    public function getMessages($sid = null) {
        if ($sid) {
            $session = GameSession::where('id', '=', $sid)->with('messages')->first();
            $messages = $session->messages();
        }
        if (isset($messages) && count($messages)) {
            return response()->json([
                'messages' => $messages
            ]);
        }

        return response()->json([
            'error' => "NO_GAMES_FOUND",
        ], 404);
    }
}