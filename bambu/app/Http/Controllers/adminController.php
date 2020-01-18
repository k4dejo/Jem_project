<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\Admin;
use Input;

class adminController extends Controller
{
    public function AuthAdmin(Request $request) {
        //recibir post
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);

        //comprobar admin existente
        $user     = (!is_null($json) && isset($params->user)) ? $params->user : null;
		$password = (!is_null($json) && isset($params->password)) ? $params->password : null;
        $priority    = (!is_null($json) && isset($params->priority)) ? $params->priority : null;
        if (isset($priority)) {
            $isset_admin = admin::where('priority', '=', $priority)->first();
            $auth = array(
                'status' => 'admin',
                'code'  => 200,
            );
            return response()->json($auth, 200);
        }
        return response()->json(array(
            'status' => 'NonAuth'
        ), 200);
    }

    public function VerifyPass(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);

        if ($checkToken) {
            $jwtAuth = new jwtAuthAdmin();

            //recibir post
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);

            $password = (!is_null($json) && isset($params->oldPass)) ? $params->oldPass : null;
            $priority = (!is_null($json) && isset($params->priority)) ? $params->priority : null;
            $getToken = (!is_null($json) && isset($params->getToken))? $params->getToken : null;

            //cifrar pass
            $pwd = hash('sha256', $password);
            $signup = $jwtAuth->verifyPassword($password, $priority,$getToken);
            return $signup;
        }
    }

    public function login(Request $request)
    {
        $jwtAuth = new jwtAuthAdmin();

        //recibir post
        $json =  $request->input('json', null);
        $params = json_decode($json);

        $user     = (!is_null($json) && isset($params->user)) ? $params->user : null;
        $password = (!is_null($json) && isset($params->password)) ? $params->password : null;
        $getToken = (!is_null($json) && isset($params->getToken))? $params->getToken : null;

        //cifrar pass
        $pwd = hash('sha256', $password);

        if (!is_null($user) && !is_null($password) && ($getToken == null || $getToken == 'false')) {
            $signup = $jwtAuth->signup($user, $password);

        }elseif ($getToken != null) {
            $signup = $jwtAuth->signup($user, $password, $getToken);

        }else{
            $signup = array(
                'status'  => 'Error',
                'message' => 'Usuario no existe'
            );
        }

        return response()->json($signup, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
