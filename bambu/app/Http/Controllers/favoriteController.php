<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Helpers\jwtAuthAdmin;
use App\article;
use App\client;

class favoriteController extends Controller
{

    public function likeProduct(Request $request) {
	   	// recoger datos del POST
	    $json =  $request->input('json', null);
	    $params = json_decode($json);
	    $paramsArray = json_decode($json,true);
	    //Hacer la relación de articulos a la relacion 
	    $client = client::findOrFail($params->clientId);
	    $client->sizes()->attach($params->productId);

	    $data = array(
	        'status'  => 'success',
	        'code'    => 200,
	    );
	    return response()->json($data, 200);
	}
}
