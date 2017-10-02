<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('postAdminReset');
    }

    public function postAdminReset(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|exists:users',
            'password' => 'required|max:255'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->messages()], 200);

        $user = User::where('email', '=', Input::get('email'))->first();
        if($user){
            $user->password = bcrypt(Input::get('password'));
            $user->save();
            return response()->json(['success' => 'PASSWORD_UPDATED', 'username' => $user->username]);
        }
        return response()->json(['error' => 'USER_NOT_FOUND']);
    }
}
