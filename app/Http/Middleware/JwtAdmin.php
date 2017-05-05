<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtAdmin {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param  string|null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null) {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user && $user->is_admin) {
                return $next($request);
            } else {
                return response()->json([
                    'error' => "token_invalid",
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'token_invalid'], 401);
        }
    }
}
