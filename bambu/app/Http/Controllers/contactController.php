<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\support\Facades\Validator;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Input;

class contactController extends Controller
{
    public function sendEmail(Request $request) {
        // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //validacion
        $validate = Validator::make($paramsArray, [
            'name'    => 'required',
            'email'   => 'required',
            'subject' => 'required',
            'message' => 'required'
        ]);
        if ($validate->fails()) {
            return response()->json($validate->errors(),400);
        }
        $msg = null;
        $data = array(
            'name' => $params->name,
            'email' => $params->email,
            'subject' => $params->subject,
            'msg' => $params->message
        );
        $fromEmail = 'breinersalas14@gmail.com';
        $fromName = 'Nuevo correo de contacto Modajem.com';
        Mail::send('emails.contact', $data, function ($message) use ($fromName, $fromEmail) {
            $message->to($fromEmail, $fromName);
            $message->from($fromEmail, $fromName);
            $message->subject('¡Nuevo email de la tienda!');
        });

        return response()->json(array(
            'articles' => $data,
            'status'   => 'success'
        ), 200);
    }
}
