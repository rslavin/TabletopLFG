<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Psy\Util\Json;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function postForgot(Request $request){
        $this->validate($request, [
            'email' => 'required|email',
        ]);

        // generate token
        $user = User::where('email', '=', Input::get('email'))->first();
        if($user) {
            app('auth.password.broker')->createToken($user);

            // todo email user with token (need to make a view and possibly replace PasswordResetMail with our own code)
            $resetLink = ""; // create link
            $email = new PasswordResetMail($resetlink);
            \Mail::to($user->email)->send($email);
        }// don't do an else. If the user doesn't exist, we don't want them to know it.
    }
}
