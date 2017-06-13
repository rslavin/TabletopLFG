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
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class GameMessageController {
    public function getMessages($sid) {
        $messages = GameMessage::where('game_session_id', '=', $sid)->with('user')->orderBy('created_at', 'desc')->get();

        if (isset($messages) && count($messages)) {
            return response()->json([
                'messages' => $messages
            ]);
        }

        return response()->json([
            'error' => "NO_MESSAGES_FOUND",
        ], 404);
    }

    public function postMessage(Request $request) {
        $validator = Validator::make($request->all(), [
            'message' => 'string|max:500',
            'game_session_id' => 'required|exists:game_sessions,id',
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return response()->json(['error' => 'INVALID_TOKEN'], 401);
        }

        $message = new GameMessage;
        $message->user_id = $user->id;
        $message->game_session_id = $request->game_session_id;
        $message->message = $request->message;

        $message->save();
        return response()->json(['message' => $message]);
    }
}
