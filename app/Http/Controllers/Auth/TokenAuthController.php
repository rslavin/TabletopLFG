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
class TokenAuthController extends Controller {
    public function authenticate(Request $request) {
        $credentials = $request->only('username', 'password');

        $customClaims = array();

        // if request has 'remember me', set ttl to 2 weeks
        if ($request->has('remember') && $request->get('remember')) {
            $customClaims = [
                'exp' => strtotime('+1 week')
            ];
        }

        try {
            if (!$token = JWTAuth::attempt($credentials, $customClaims)) {
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

            return response()->json(['INVALID_TOKEN'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['TOKEN_MISSING'], $e->getStatusCode());

        }

        return response()->json(compact('user'));
    }

    public function register(Request $request) {
        // TODO add email verification
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:32|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6', // confirmation should be done on the client
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 200);
        }

        $newuser = $request->all();
        $password = Hash::make($request->input('password'));

        $newuser['password'] = $password;

        return User::create($newuser);
    }

    public function invalidateToken() {
        JWTAuth::parseToken()->invalidate();
    }
}
