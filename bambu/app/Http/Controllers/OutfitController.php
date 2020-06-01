<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\outfit;
use App\article;


class OutfitController extends Controller
{
	public function index(Request $request)
    {
       //listado de los outfits
        $outfits = outfit::all();
        $outfitCount = count($outfits);
        /*if ($outfitCount <= 0) {
            return response()->json(array(
                'outfits' => $outfits,
                'status'   => 'void'
            ), 200);
        }
        if ($outfitCount > 1) {
            for ($i=0; $i < $outfitCount ; $i++) {
                $contents = Storage::get($outfits[$i]->photo);
                $outfits[$i]->photo = base64_encode($contents);
            }
        }else{
            $contents = Storage::get($outfits[0]->photo);
            $outfits[0]->photo = base64_encode($contents);
        }*/
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
            $validate = Validator::make($paramsArray, [
                'name'   => 'required',
                'photo'  => 'required'
            ]);

            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }

            $img =  $params->file;
            $img = str_replace('data:image/jpeg;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $imgName = time() . $params->photo;
            Storage::disk('public')->put($imgName, base64_decode($img));
            // guardar los datos
            $outfits = new outfit();
            $outfits->name  = $params->name;
            $outfits->photo = $imgName;
            $outfits->save();

            $data = array(
                'outfits' => $outfits ,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
			//Error
            $data = array(
                'message' => 'login incorrecto',
                'status'  => 'Error',
                'code'    => 400,
            );
        }
        return response()->json($data, 200);
    }

    public function editOutfit($id, Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);
            //validacion
            $validate = Validator::make($paramsArray, [
                'name'   => 'required',
                'photo'        => 'required',
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $imgDB = outfit::where('id', $id)->first();
            $lengthImg = strlen($params->photo);
            $isWeb = explode(':', $params->file);
            if ($isWeb[0] == 'https') {
                $imgName = time() . $params->photo;
                unset($paramsArray['id']);
                unset($paramsArray['created_at']);
                unset($paramsArray['file']);
                unset($paramsArray['photo']);
                $outfit = outfit::where('id', $id)->update($paramsArray);
            } else {
                if ($lengthImg <= 100) {
                    $img =  $params->file;
                    $img = str_replace('data:image/jpeg;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    $imgName = time() . $params->photo;
                    $paramsArray['photo'] = $imgName;
                    unset($paramsArray['id']);
                    unset($paramsArray['created_at']);
                    unset($paramsArray['file']);
                    Storage::delete($imgDB->photo);
                    Storage::disk('public')->put($imgName, base64_decode($img));
                    $outfit = outfit::where('id', $id)->update($paramsArray);
                }else {
                    $route = public_path().'\catalogo'.'\/';
                    $imgRoute = str_replace('/', '', $route);
                    $imgRoute = $imgRoute . $paramsArray['photo'];
                    Storage::delete($imgDB->photo);
                    $paramsArray['photo'] = time() .'.jpg';
                    $img = $paramsArray['file'];
                    $img = str_replace('data:image/jpeg;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    unset($paramsArray['id']);
                    unset($paramsArray['created_at']);
                    unset($paramsArray['file']);
                    Storage::disk('public')->put($paramsArray['photo'], base64_decode($img));
                    $outfit = outfit::where('id', $id)->update($paramsArray);
                }
            }
            $data = array(
                'outfit' => $outfit,
                'status'  => 'success',
                'code'    => 200
            );
        } else {
            // Error
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data,200);

    }

    public function AttachOutfits(Request $request)
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

    public function getOutfitProduct() {
        $outfits = outfit::all();
        $outfitCount = count($outfits);
        for ($i=0; $i < $outfitCount ; $i++) {
            foreach ($outfits[$i]->articles as $article) {
                //obteniendo los datos de un task específico
                $articleRes = $article->outfits;
            }
            //intentar traer el blob desde el controller
            /*$contents = Storage::get($outfits[$i]->photo);
            $outfits[$i]->photo = base64_encode($contents);
            $outfits[$i]->photo = 'data:image/jpeg;base64,' . base64_encode($contents);*/
        }
        return response()->json(array(
            'outfit' => $outfits,
            'articles'  => $articleRes
        ), 200);
    }

    public function showOutfitList($id) {
        $outfit = outfit::findOrfail($id);
        $arrayOutfit = outfit::find($id)->articles()->get();
        $data = array(
            'outfit'       => $arrayOutfit,
            'status'       => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);
    }

    public function detachOutfits(Request $request) {
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        $article = article::findOrFail($params->article_id);
        $article->outfits()->detach($params->outfit_id);
        $data = array(
            'article' => $article,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function deleteOutfit($id){
        //delete the relationships with first.
        $outfit = outfit::findOrFail($id);
        $outfit->articles()->detach();
        //delete img
        $route = public_path().'\catalogo'.'\/';
        $imgRoute = str_replace('/', '', $route);
        $imgRoute = $imgRoute . $outfit->photo;
        Storage::delete($outfit->photo);
        $outfit->delete();
        $data = array(
            'outfit' => $outfit,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
