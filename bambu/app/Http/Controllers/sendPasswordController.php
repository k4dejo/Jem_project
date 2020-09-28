<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\support\Facades\Validator;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Input;
use App\client;
use App\Mail\resetPasswordMail;

class sendPasswordController extends Controller
{
    public function sendEmail(Request $request) {
        $json = $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json, true);
        if (!$this->validatedEmail($params->email)) {
            return $this->failedResponse();
        }
        $this->send($params->email);
        return $this->successResponse();
    }

    public function send($email) {
        $token = $this->createToken($email);
        Mail::to($email)->send(new resetPasswordMail($token));
    }

    public function createToken($email) {
        $oldToken = DB::table('reset_password')->where('email', $email)->first();
        if ($oldToken) {
            return $oldToken->token;
        }
        $token = str_random(60);
        $this-> saveToken($token, $email);
        return $token;
    }

    public function saveToken($token, $email) {
        DB::table('reset_password')->insert([
            'email'      => $email,
            'token'      => $token,
            'created_at' => Carbon::now()
        ]);
    }

    public function validatedEmail($email) {
        return  !!client::where('email', '=', $email)->first();
    }

    public function successResponse(){
        return response()->json([
            'data' => 'El correo de restablecimiento se ha enviado, por favor revisa tu bandeja de entrada'
        ]);
    }

    public function failedResponse() {
        return response()->json([
            'error' => 'email no se ha encontrado en nuestra base de datos'
        ]);
    }
}
