<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuth;
use App\article;
use App\client;

class favoriteController extends Controller
{
	public function likeProduct(Request $request) {
       // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //Hacer la relación de articulos a la relacion articulos_talla con el atributo de cantidad
        $client = client::findOrFail($params->clientId);
        $client->articles()->attach($params->articleId);

        $data = array(
            'status'  => 'success',
            'code'    => 200,
        );
        return response()->json($data, 200);
	}

    public function detachLike(Request $request){
       // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //delete the relationships with first.
        $client = client::findOrFail($params->clientId);
        $client->articles()->detach($params->articleId);
        $data = array(
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function showFavoriteList($idClient) {
        $favoriteClient = DB::table('clients')->where('id', $idClient)->first();
        $arrayFavorite = client::find($favoriteClient->id)->articles()->get();
        $countFavorite = count($arrayFavorite);
        if ($countFavorite > 0) {
            for ($i=0; $i < $countFavorite; $i++) {
                $contents = Storage::get($arrayFavorite[$i]->photo);
                $arrayFavorite[$i]->photo = base64_encode($contents);
            }
            $data = array(
                'favorite'       => $arrayFavorite,
                'status'         => 'success',
                'code'    => 200,
            );
        } else {
            $data = array(
                'status'         => 'void',
                'code'    => 200,
            );
        }
        return response()->json($data,200);
    }

    public function showlikeFocus($idClient, $idProduct) {
    	$client = client::findOrFail($idClient);
        foreach ($client->articles as $article) {
            // obteniendo los datos de un task específico
            $product = $article->pivot;
        }
        $productsCount = count($client->articles);
		$data = array(
			'status'  => 'nonLike',
    		'code'    => 200
    	);
        for ($i=0; $i < $productsCount; $i++) {
        	if ($client->articles[$i]->pivot->article_id == $idProduct &&
    		$client->articles[$i]->pivot->client_id == $idClient) {
		        $data = array(
		        	'status'  => 'liked',
		        	'code'    => 200
		        );
        	} elseif ($i == $productsCount) {
        		$data = array(
        			'status'  => 'nonLike',
            		'code'    => 200
            	);
        	}
        }
        return response()->json($data, 200);
    }
}
