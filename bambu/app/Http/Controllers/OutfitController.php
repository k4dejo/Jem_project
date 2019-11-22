<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use App\Helpers\jwtAuthAdmin;
use App\outfit;
use App\article;


class OutfitController extends Controller
{
	public function index(Request $request)
    {
       //listado de los outfits
        $outfits = outfit::all();
        return response()->json(array(
            'outfits' => $outfits,
            'status'  => 'success'
        ), 200);
    }

    public function show($id)
    {
        $outfits = outfit::find($id);
        return response()->json(array(
            'outfit' => $outfits,
            'status' => 'success'
        ), 200);
    }
    public function store(Request $request)
    {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);

        if ($checkToken) {
        	// recoger datos del POST
        	$json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);

            //validacion
            $validate = Validator::make($paramsArray, ['name'   => 'required']);

            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }

            // guardar los datos
            $outfits = new outfit();
            $outfits->name = $params->name;

            $outfits->save();

            $data = array(
                'outfits' => $outfits ,
                'status'  => 'success',
                'code'    => 200,
            );
        }else
        {
			//Error
            $data = array(
                'message' => 'login incorrecto',
                'status'  => 'Error',
                'code'    => 400,
            );
        }
        return response()->json($data, 200);
    }

    public function Attachsize(Request $request)
    {
    	// recoger datos del POST
        	$json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);

    	//Hacer la relación de articulos a outfits
		$article = article::findOrFail($params->article_id);
        $article->outfits()->attach($params->outfit_id);

        $data = array(
            'article' => $article,
            'status'  => 'success',
            'code'    => 200,
        );
        return response()->json($data, 200);
    }
}
