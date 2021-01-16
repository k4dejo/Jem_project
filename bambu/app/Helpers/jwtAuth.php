<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\client;

/**
 *
 */
class jwtAuth
{
	public $key;
	public function __construct()
	{
		$this->key = 'tome-pal-pinto-01';
	}

	public function signup($phone, $password, $getToken=null)
	{
		$Client = client::where(array(
			'phone' => $phone,
			'password' => $password
        ))->first();

		$signup = false;

		if (is_object($Client)) {
			$signup = true;
        }

		if ($signup) {
            //generar token y returnar
            $token = array(
                'sub' => $Client->id,
                'phone' => $Client->phone,
                'name' => $Client->name,
                'email' => $Client->email,
                'address' => $Client->address,
                'addressDetail'=> $Client->addressDetail,
                'shops_id' => $Client->shops_id,
                'iat' => time(),
                'exp' => time() + (7 * 24 * 60 *60)
            );

			$jwt = JWT::encode($token,$this->key, 'HS256');
			$decoded = JWT::decode($jwt,$this->key, array('HS256'));

			if (is_null($getToken)) {
				return $jwt;
			}else{
				return $decoded;
			}
		}else{
			//returnar error
			return array('status' => 'Error', 'message' => 'Fallo al ingresar');
		}
	}

	public function checkToken($jwt, $getIdentity = false)
	{
		$auth = false;

		try
		{
			$decoded = JWT::decode($jwt, $this->key, array('HS256'));
		}catch(\UnexpectedValueException $e){
			$auth = false;
		}catch(\DomainException $e){
			$auth = false;
		}

		if (isset($decoded) && is_object($decoded) && isset($decoded->sub)) {
			$auth = true;
		}else{
			$auth = false;
		}

		if ($getIdentity) {
			return $decoded;
		}

		return $auth;
	}
}
