<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use App\apart;
use App\size;
use App\client;
use App\article;

class apartController extends Controller
{
    public function index()
    {
       //listado de las compras del cliente
        $aparts = apart::all();
        return response()->json(array(
            'aparts' => $aparts,
            'status'   => 'success'
        ), 200);
    }

    public function store(Request $request)
    {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);

        if ($checkToken) {
            //recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            $apart = new apart();
            //validación
            $validate = Validator::make($paramsArray, [
                'clients_id'   => 'required',
                'price'        => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $apart->clients_id = $params->clients_id;
            $apart->price = $params->price;
            $isset_apart = DB::table('aparts')->where('clients_id', $params->clients_id)->get();
            $countapart = count($isset_apart);
            if ($countapart == 0) {
                $apart->save();
                $getApart = apart::where('clients_id', $params->clients_id);
                $data = array(
                    'apart'   => $getApart,
                    'status'     => 'success',
                );
            }
            $getApart = apart::where('clients_id', $params->clients_id)->first();
            $data = array(
                'apart'   => $getApart,
                'status'     => 'Exist',
            );
            return response()->json($data,200);
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

    public function attachProductApart(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //Hacer la relación del articulo con la compra con el atributo de cantidad y talla
            $apart = apart::findOrFail($params->apart_id);
            $apart->articles()->
            attach($params->article_id,['amount'=>$params->amount, 'size'=>$params->size]);

            $data = array(
                'Apart' => $apart,
                'status'  => 'success',
                'code'    => 200,
            );
            return response()->json($data, 200);
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

    public function dettachProductApart(Request $request) {
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //validación
        $validate = Validator::make($paramsArray, [
            'apart_id'      => 'required',
            'article_id'    => 'required'
        ]);
        if ($validate->fails()) {
            return response()->json($validate->errors(),400);
        }
        $apart = apart::findOrFail($params->apart_id);
        $apart->articles()->wherePivot('size', $params->size)->detach($params->article_id);
        $data = array(
            'apart'   => $apart,
            'request' => $paramsArray,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function getApart($idApart) {
        //$ApartClient = DB::table('aparts')->where('clients_id', $idApart)->first();
        $arrayApart = apart::find($idApart)->articles()->get();
        $countApart = count($arrayApart);
        for ($i=0; $i < $countApart; $i++) {
            $contents = Storage::get($arrayApart[$i]->photo);
            $arrayApart[$i]->photo = base64_encode($contents);
        }
        $data = array(
            'apart'       => $arrayApart,
            'status'         => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);
    }

    public function getApartClient($idClient) {
        $ApartClient = DB::table('aparts')->where('clients_id', $idClient)->first();
        $arrayApart = apart::find($ApartClient->id)->articles()->get();
        $countApart = count($arrayApart);
        if ($countApart  > 0) {
            for ($i=0; $i < $countApart; $i++) {
                $contents = Storage::get($arrayApart[$i]->photo);
                $arrayApart[$i]->photo = base64_encode($contents);
            }
            $data = array(
                'apart'       => $arrayApart,
                'status'         => 'success',
                'code'    => 200,
            );
        } else {
            $data = array(
                'msg'       => 'void',
                'status'         => 'success',
                'code'    => 200,
            );
        }

        return response()->json($data,200);
    }

    public function checkSizeIdApart( $idProduct, $size) {
        $productSize = article::find($idProduct)->sizes()->get();
        $countGetProduct = count($productSize);
        for ($i=0; $i < $countGetProduct; $i++) {
            if ($productSize[$i]->size == $size) {
                $data = array(
                    'sizeId' => $productSize[$i]->id,
                    'status'  => 'success',
                    'code'    => 200,
                );
                return response()->json($data,200);
            }
        }
        return 'Error';
    }

   public function checkAmountProduct($sizeId, $productId) {
    $productSize = article::find($productId)->sizes()->get();
    $countGetProduct = count($productSize);
    for ($i=0; $i < $countGetProduct; $i++) {
        if ($productSize[$i]->id == $sizeId) {
            if ($productSize[$i]->pivot->stock > 0) {
                $data = array(
                    'sizeId' => $productSize[$i]->id,
                    'amountCheck' => 'success',
                    'status'  => 'success',
                    'code'    => 200,
                );
            }else {
                $data = array(
                    'sizeId' => $productSize[$i]->id,
                    'amountCheck' => 'void',
                    'status'  => 'success',
                    'code'    => 200,
                );
            }
            return response()->json($data,200);
        }
    }
   }

    public function changeAmountProduct($idProduct, $sizeId, $isDelete, Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            $arrayProduct = article::find($idProduct)->sizes()->get();
            $countGetProduct = count($arrayProduct);
            for ($i=0; $i < $countGetProduct; $i++) {
                //return $sizeId;
                if ($arrayProduct[$i]->pivot->size_id == $sizeId) {
                    if ($isDelete == 'rest') {
                        $arrayProduct[$i]->pivot->stock = $arrayProduct[$i]->pivot->stock   + $params->amount;
                    } else {
                        $arrayProduct[$i]->pivot->stock = $arrayProduct[$i]->pivot->stock - $params->amount;
                    }
                    $size = size::find($arrayProduct[$i]->pivot->size_id);
                    $product = article::find($arrayProduct[$i]->pivot->article_id);
                    // modifica la cantidad del producto en la tabla pivote
                    $product->sizes()->updateExistingPivot($size->id,['stock' => $arrayProduct[$i]->pivot->stock ]);
                    $data = array(
                        'article' => $product,
                        'status'  => 'success',
                        'code'    => 200,
                    );
                    return response()->json($data,200);
                }
            }
            $data = array(
                'article' => $product,
                'code'    => 400,
            );
            return response()->json($data,200);
        }else {
            $data = array(
                'mgs' => 'token invalido',
                'status'  => 'fail',
                'code'    => 400,
            );
        }
        return response()->json($data,200);
    }

    /*public function changeAmountProduct($idProduct, $sizeId,Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            $arrayProduct = article::find($idProduct)->sizes()->get();
            $countGetProduct = count($arrayProduct);
            for ($i=0; $i < $countGetProduct; $i++) {
                //return $sizeId;
                if ($arrayProduct[$i]->pivot->size_id == $sizeId) {
                    $arrayProduct[$i]->pivot->stock = $arrayProduct[$i]->pivot->stock - $params->amount;
                    $size = size::find($arrayProduct[$i]->pivot->size_id);
                    $product = article::find($arrayProduct[$i]->pivot->article_id);
                    // modifica la cantidad del producto en la tabla pivote
                    $product->sizes()->updateExistingPivot($size->id,['stock' => $arrayProduct[$i]->pivot->stock ]);
                    $data = array(
                        'article' => $product,
                        'status'  => 'success',
                        'code'    => 200,
                    );
                    return response()->json($data,200);
                }
            }
        }else {
            $data = array(
                'mgs' => 'token invalido',
                'status'  => 'fail',
                'code'    => 400,
            );
        }
        return response()->json($data,200);
    }*/

    public function editApart(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);
            //validacion
            $validate = Validator::make($paramsArray, [
                'clients_id'   => 'required',
                'price'        => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            unset($paramsArray['id']);
            unset($paramsArray['created_at']);
            $apart = apart::where('id', $params->id)->update($paramsArray);
            $data = array(
                'apart' => $apart,
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
}
