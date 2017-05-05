<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Use Authorization: Bearer {yourtokenhere} in the header to authenticate
 * Class TokenAuthController
 * @package App\Http\Controllers\Auth
 */
class TokenAuthController extends Controller  {
    public function authenticate(Request $request) {
        $credentials = $request->only('username', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'INVALID_CREDENTIALS'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'COULD_NOT_GENERATE_TOKEN'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    public function getAuthenticatedUser() {
        try {

            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['USER_NOT_FOUND'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['TOKEN_EXPIRED'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['TOKEN_INVALID'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['TOKEN_MISSING'], $e->getStatusCode());

        }

        return response()->json(compact('user'));
    }

    public function register(Request $request) {
        // TODO add email verification
        $validator = Validator::make($request->all(), [
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'username' => 'required|string|max:16|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages(), 200);
        }

        $newuser = $request->all();
        $password = Hash::make($request->input('password'));

        $newuser['password'] = $password;

        return User::create($newuser);
    }
}
