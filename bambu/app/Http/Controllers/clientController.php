<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\jwtAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\client;

class clientController extends Controller
{

    public function editClient($id, Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuth = new jwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if ($checkToken) {
            //recibir post
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);
            $name      = (!is_null($json) && isset($params->name)) ? $params->name : null;
            $phone     = (!is_null($json) && isset($params->phone)) ? $params->phone : null;
            $email     = (!is_null($json) && isset($params->email)) ? $params->email : null;
            $dni       = (!is_null($json) && isset($params->dni)) ? $params->dni : null;
            $address   = (!is_null($json) && isset($params->address)) ? $params->address : null;
            $addressDetail = (!is_null($json) && isset($params->addressDetail)) ? $params->addressDetail :null;
            $isset_client = client::where('id', '=', $id)->first();
            $lengthImg = strlen($params->photo);
            if ($isset_client != null) {
                if ($lengthImg <= 100) {
                    $img =  $params->file;
                    $img = str_replace('data:image/jpeg;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    $imgName = time() . $params->photo;
                    $paramsArray['photo'] = $imgName;
                    Storage::delete($imgDB->photo);
                    Storage::disk('public')->put($imgName, base64_decode($img));

                    //guardar cliente
                    $client_save = client::where('id', $id)->update([
                        'name'          => $name,
                        'phone'         => $phone,
                        'email'         => $email,
                        'dni'           => $dni,
                        'address'       => $address,
                        'photo'         => $imgName,
                        'addressDetail' => $addressDetail
                    ]);
                } else {
                    $route = public_path().'\catalogo'.'\/';
                    $imgRoute = str_replace('/', '', $route);
                    $imgRoute = $imgRoute . $paramsArray['photo'];
                    Storage::delete($isset_client->photo);
                    $paramsArray['photo'] = time() .'_client.jpg';
                    $img = $paramsArray['file'];
                    $img = str_replace('data:image/jpeg;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    Storage::disk('public')->put($paramsArray['photo'], base64_decode($img));

                    //guardar cliente
                    $client_save = client::where('id', $id)->update([
                        'name'          => $name,
                        'phone'         => $phone,
                        'email'         => $email,
                        'dni'           => $dni,
                        'address'       => $address,
                        'photo'         => $paramsArray['photo'],
                        'addressDetail' => $addressDetail
                    ]);
                }
                $data = array(
                    'status'  => 'success',
                    'code'    => 200,
                    'message' => 'cliente registrado correctamente'
                );
            }else{
                //admin existe
                $data = array(
                    'status'  => 'duplicate',
                    'code'    => 400,
                    'message' => 'El cliente no existe'
                );
            }

        }else {
            $data = array(
                'status'  => 'Error',
                'code'    => 400,
                'message' => 'permiso denegado'
            );
        }
        return response()->json($data, 200);
    }
    public function getClientPhoto($idClient) {
        $client = client::where('id', '=', $idClient)->first();
        if ($client->photo !== 'assets/Images/default.jpg') {
            $contents = Storage::get($client->photo);
            $link = public_path('\catalogo\/'.$client->photo);
            $img = \Image::make($link);
            // $img = Image::make(file_get_contents($link));
            $client->photo = base64_encode($contents);
        }
        if ($client != null) {
            $data = array(
                'clientPhoto'  => $client->photo,
                'status'  => 'success',
                'linkImg' => $img->basename,
                'code'    => 200,
            );
        } else {
            $data = array(
                'clientPhoto'  => $client->photo,
                'status'  => 'fail',
                'code'    => 200,
            );
        }
        return response()->json($data, 200);
    }

    public function getClientInfo($idClient) {
        $client = client::where('id', '=', $idClient)->first();
        if ($client->photo !== 'assets/Images/default.jpg') {
            $contents = Storage::get($client->photo);
            $client->photo = base64_encode($contents);
        }
        if ($client != null) {
            $data = array(
                'client'  => $client,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
            $data = array(
                'client'  => $client,
                'status'  => 'fail',
                'code'    => 200,
            );
        }
        return response()->json($data, 200);
    }

	public function register(Request $request)
	{
		//recoger post
		$json = $request->input('json', null);
		$params = json_decode($json);

		$name          = (!is_null($json) && isset($params->name)) ? $params->name : null;
		$password      = (!is_null($json) && isset($params->password)) ? $params->password : null;
		$phone         = (!is_null($json) && isset($params->phone)) ? $params->phone : null;
        $email         = (!is_null($json) && isset($params->email)) ? $params->email : null;
        $dni           = (!is_null($json) && isset($params->dni)) ? $params->dni : null;
        $address       = (!is_null($json) && isset($params->address)) ? $params->address : null;
        $photo         = (!is_null($json) && isset($params->photo)) ? $params->photo : null;
		$addressDetail = (!is_null($json) && isset($params->addressDetail)) ? $params->addressDetail :null;
		$shops_id      = (!is_null($json) && isset($params->shops_id)) ? $params->shops_id : null;

		if (!is_null($name) && !is_null($password) && !is_null($phone)) {
			//crear cliente
			$client = new client();
			$client->name          = $name;
			$client->password      = $password;
			$client->phone         = $phone;
            $client->email         = $email;
            $client->dni           = $dni;
            $client->address       = $address;
            $client->photo         = $photo;
			$client->addressDetail = $addressDetail;
            $client->shops_id      = $shops_id;
            $img =  $params->file;
            /*$img = str_replace('data:image/jpeg;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $imgName = time() . $params->photo;
            Storage::disk('public')->put($imgName, base64_decode($img));*/

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
