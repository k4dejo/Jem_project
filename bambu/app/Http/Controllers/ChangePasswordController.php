<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\support\Facades\Validator;
use App\client;

class ChangePasswordController extends Controller
{
    public function process(Request $request) {
        $json = $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json, true);
        $validate = \Validator::make($paramsArray, [
            'email' => 'required|email',
            'password' => 'required|confirmed'
        ]);
        if ($validate->fails()) {
            return response()->json($validate->errors(),400);
        }
        return $this->getPasswordResetTableRow($params->email, $params->resetToken)->count() > 0 ?
        $this->changePassword($params->email, $params->password, $params->resetToken) : $this->tokenNotFoundResponse();
    }

    private function getPasswordResetTableRow($requestEmail, $requestToken) {
        return DB::table('reset_password')
        ->where(['email' => $requestEmail, 'token' => $requestToken]);
    }

    private function tokenNotFoundResponse() {
        return response()->json([
            'error' => 'El token o email son incorrectos'
        ]);
    }

    private function changePassword($requestEmail, $requestPassword, $requestToken) {
        $client = client::where('email', $requestEmail)->first();
        $pwd = hash('sha256', $requestPassword);
        $client->update(['password' => $pwd]);
        $this->getPasswordResetTableRow($requestEmail, $requestToken)->delete();
        return response()->json([
            'data'  => 'contraseña restablecida con exito!',
            'status' => 200
        ]);

    }
}
