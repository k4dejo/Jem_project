<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\Admin;

/**
 *
 */
class jwtAuthAdmin
{
	public $key;
	public function __construct()
	{
		$this->key = 'tome-pal-pinto-01';
    }

    public function verifyPasswordAuth($password, $priority, $getToken=null) {
        $user = Admin::where(array(
			'priority' => $priority,
			'password' => $password
        ))->first();

        $verify = false;

		if (is_object($user)) {
			$verify = true;
        }

        if ($verify) {
            return $user;
        }else{
			//retornar error
			return array('status' => 'Error', 'message' => 'contraseña no coincide');
		}
    }

	public function signup($user, $password, $getToken=null)
	{
		$user = Admin::where(array(
			'user' => $user,
			'password' => $password
		))->first();

		$signup = false;

		if (is_object($user)) {
			$signup = true;
        }

		if ($signup) {
			//generar token y retornar
			$token = array(
				'sub' => $user->id,
				'user' => $user->user,
				'priority' => $user->priority,
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
			//retornar error
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
