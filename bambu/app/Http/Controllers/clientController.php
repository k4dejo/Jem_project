<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\jwtAuth;
use Illuminate\Support\Facades\DB;
use App\client;

class clientController extends Controller
{
	public function register(Request $request)
	{
		//recoger post
		$json = $request->input('json', null);
		$params = json_decode($json);

		$name     = (!is_null($json) && isset($params->name)) ? $params->name : null;
		$password = (!is_null($json) && isset($params->password)) ? $params->password : null;
		$phone    = (!is_null($json) && isset($params->phone)) ? $params->phone : null;
		$email    = (!is_null($json) && isset($params->email)) ? $params->email : null;
		$address   = (!is_null($json) && isset($params->address)) ? $params->address : null;
		$addressDetail = (!is_null($json) && isset($params->addressDetail)) ? $params->addressDetail :null;
		$shops_id = (!is_null($json) && isset($params->shops_id)) ? $params->shops_id : null;

		if (!is_null($name) && !is_null($password) && !is_null($phone)) {
			//crear cliente
			$client = new client();
			$client->name     = $name;
			$client->password = $password;
			$client->phone    = $phone;
			$client->email    = $email;
			$client->address   = $address;
			$client->addressDetail = $addressDetail;
			$client->shops_id = $shops_id;

			$pwd = hash('sha256', $password);
			$client->password = $pwd;

			//comprobar cliente existente
			$isset_client = client::where('phone', '=', $phone)->first();
			if ($isset_client == null) {
				//guardar cliente
				$client->save();
				$data = array(
					'status'  => 'success',
					'code'    => 200,
					'message' => 'cliente registrado correctamente'
				);
			}else{
				//cliente existe
				$data = array(
					'status'  => 'duplicate',
					'code'    => 400,
					'message' => 'El cliente ya existe'
				);
			}
		}else {
			$data = array(
				'status'  => 'Error',
				'code'    => 400,
				'message' => 'Cliente no registrado'
			);
		}
		return response()->json($data, 200);
    }

    public function getClientList() {
        $client = client::all();
        $data = array(
            'clients' => $client,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function login(Request $request)
	{
		$jwtAuth = new jwtAuth();

		//recibir post
		$json =  $request->input('json', null);
		$params = json_decode($json);

		$phone    = (!is_null($json) && isset($params->phone)) ? $params->phone : null;
		$password = (!is_null($json) && isset($params->password)) ? $params->password : null;
		$getToken = (!is_null($json) && isset($params->getToken))? $params->getToken : null;

		//cifrar pass
		$pwd = hash('sha256', $password);

		if (!is_null($phone) && !is_null($password) && ($getToken == null || $getToken == 'false')) {
			$signup = $jwtAuth->signup($phone, $pwd);

		}elseif ($getToken != null) {
			$signup = $jwtAuth->signup($phone, $pwd,$getToken);

		}else{
			$signup = array(
				'status' => 'Error',
				'message' => 'Usuario no existe'
			);
		}

		return response()->json($signup, 200);
	}
}
