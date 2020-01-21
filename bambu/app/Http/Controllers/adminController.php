<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\Admin;
use App\client;
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

            $oldPassword = (!is_null($json) && isset($params->oldPass)) ? $params->oldPass : null;
            $newPassword = (!is_null($json) && isset($params->newPass)) ? $params->newPass : null;
            $priority = (!is_null($json) && isset($params->priority)) ? $params->priority : null;
            $getToken = (!is_null($json) && isset($params->getToken))? $params->getToken : null;

            //cifrar pass
            $Oldpwd = hash('sha256', $oldPassword);
            if (!is_null($priority) && !is_null($oldPassword)) {
                $DBpass = $jwtAuth->verifyPasswordAuth($Oldpwd, $priority);
                if ($DBpass != null) {
                    $newPwd = hash('sha256', $newPassword);
                    $adminPassUpdate = Admin::where('priority', $priority)
                    ->update(['password' => $newPwd]);
                    return response()->json(array(
                        'message' => 'contraseña restablecida',
                        'status'   => 'success'
                    ), 200);
                } else {
                    return $DBpass;
                }
            }
        }
    }

    public function createAdmin(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);

        if ($checkToken) {
            //recibir post
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);

            //comprobar admin existente
            $user     = (!is_null($json) && isset($params->user)) ? $params->user : null;
            $password = (!is_null($json) && isset($params->password)) ? $params->password : null;
            $priorityNewAdmin    = (!is_null($json) && isset($params->priority)) ? $params->priorityNew : null;
            $priorityAdmin    = (!is_null($json) && isset($params->priority)) ? $params->priorityAdmin : null;
            $isset_admin = admin::where('priority', '=', $params->priorityAdmin)->first();
            if (isset($isset_admin)) {
                $newAdmin = new Admin();
                $newAdmin->user = $user;
                $newAdmin->password = $password;
                $newAdmin->priority = $params->priorityNew;
                $pwd = hash('sha256', $password);
                $newAdmin->password = $pwd;

                //comprobar admin existente
                $isset_newAdmin = Admin::where('user', '=', $user)->first();
                if ($isset_newAdmin == null) {
                    //guardar admin
				    $newAdmin->save();
				    $data = array(
					    'status'  => 'success',
					    'code'    => 200,
					    'message' => 'Administrador registrado correctamente'
				    );
                }else{
                    //admin existe
                    $data = array(
                        'status'  => 'duplicate',
                        'code'    => 400,
                        'message' => 'El administrador ya existe'
                    );
                }
            }else {
                $data = array(
                    'status'  => 'Error',
                    'code'    => 400,
                    'message' => 'permiso de administrador denegado'
                );
            }
            return response()->json($data, 200);
        }
    }

    public function getAdminList() {
        $adminList = Admin::where('priority', '=', 0)->get();
        $data = array(
            'admis' => $adminList,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
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
            $signup = $jwtAuth->signup($user, $pwd);

        }elseif ($getToken != null) {
            $signup = $jwtAuth->signup($user, $pwd, $getToken);

        }else{
            $signup = array(
                'status'  => 'Error',
                'message' => 'Usuario no existe'
            );
        }

        return response()->json($signup, 200);
    }

    public function getClient($idClient) {
        $client = client::where('id', $idClient)->first();
        $data = array(
            'client'  => $client,
            'status' => 'success'
        );
        return response()->json($data, 200);
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
    public function destroyAdmin($id, Request $request)
    {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);

        if ($checkToken) {
            $admin = Admin::find($id);
            $admin->delete();
            $data = array(
                'admin' => $admin,
                'status'  => 'success',
                'code'    => 200
            );
        }else{
            $data = array(
                'status'  => 'Error',
                'message' => 'permiso de administrador denegado'
            );
        }
        return response()->json($data, 200);
    }
}
