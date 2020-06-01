<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\image;
use App\article;

class imageController extends Controller
{

    public function index()
    {
        //
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
            $validate = Validator::make($paramsArray, [
                'name'        => 'required',
                'id'  => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            // guardar las imagenes del services
            $img =  $params->file;
            $img = str_replace('data:image/jpeg;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $imgName = $params->id.'_'. time() . $params->name;
            Storage::disk('public')->put($imgName, base64_decode($img));
            $image = new image();
            $image->name       = $imgName;
            $image->article_id = $params->id;
            $image->save();

            $data = array(
                'images' => $image,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
            // Error mensaje
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\image  $image
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $img = image::where('article_id', '=', $id)->get();
        $imageCount = count($img);
        if ($imageCount < 0) {
            return response()->json(array(
                'img'    => $img,
                'status' => 'void'
            ), 200);
        } else {
            /*for ($i=0; $i < $imageCount ; $i++) {
                $contents = Storage::get($img[$i]->name);
                $img[$i]->name = base64_encode($contents);
            }*/
        }
        return $img;
    }

    public function update(Request $request, image $image)
    {
        //
    }


    public function destroy($img_id)
    {
        //comprobar resgitro
        $img = image::find($img_id);
        //Borrar registro
        $route = public_path().'\catalogo'.'\/';
        $imgRoute = str_replace('/', '', $route);
        $imgRoute = $imgRoute . $img->name;
        Storage::delete($img->name);
        $img->delete();
        $data = array(
            'images' => $img,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function deleteImg($product_id)
    {
        $img = image::where('article_id', '=', $product_id)->get();
        $imageCount = count($img);
        if ($imageCount < 0) {
            return response()->json(array(
                'img'    => $img,
                'status' => 'void'
            ), 200);
        } else {
            for ($i=0; $i < $imageCount ; $i++) {
                $contents = Storage::get($img[$i]->name);
                Storage::delete($img[$i]->name);
                $img[$i]->delete();
            }
        }
        return response()->json(array(
            'status'  => 'success',
            'message' => 'Imagenes borradas'
        ), 200);

    }
}
