<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use App\article;
use App\size;
use App\billing;
use App\purchase;
use App\apart;

class sizeController extends Controller
{

	public function index(){
       //listado de las compras del cliente
        $sizesAmounts = size::all();
        return response()->json(array(
            'sizesAmounts' => $sizesAmounts,
            'status'   => 'success'
        ), 200);
    }

    public function getSizesForDepart($gender, $department) {
        $filter = size::whereHas('articles', function($q) use ($gender, $department) {
            $q->where('gender', '=', $gender)->where('department', '=', $department);
        })->get();
        $countFilter = count($filter);
        if ($countFilter > 0) {
            return response()->json(array(
                'getSizesDeparment' => $filter,
                'count' => $countFilter,
                'status'   => 'success'
            ), 200);
        } else {
            return response()->json(array(
                'getSizesDeparment' => $filter,
                'count' => $countFilter,
                'status'   => 'void'
            ), 200);
        }
    }

    public function show($id){
        $sizesAmounts = size::find($id);
        return response()->json(array(
            'size' => $sizesAmounts,
            'status' => 'success'
        ), 200);
    }

    public function store(Request $request)
    {
        // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        $size = new size();
        $size->size = $params->size;

        //validación
        $validate = Validator::make($paramsArray, [
            'size'   => 'required',
        ]);
        if ($validate->fails()) {
            return response()->json($validate->errors(),400);
        }
        $isset_size = size::where('size', '=', $params->size)->first();
        if ($isset_size == null) {
           //guardar talla
            $size->save();
            $data = array(
                'size'   => $size,
                'status' => 'success',
            );
            return response()->json($data,200);
        }else{
            //talla existe
            $data = array(
                'size'   => $isset_size,
                'status' => 'Exists',
            );
            return response()->json($data,200);
        }
    }

    public function changeAmountProduct($idProduct, Request $request) {
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
            $product = article::find($idProduct);
            $product->sizes()->updateExistingPivot($params->id,['stock' => $params->pivot->stock ]);
            $data = array(
                'article' => $product,
                'status'  => 'success',
                'code'    => 200,
            );
        }else {
            $data = array(
                'mgs' => 'token invalido',
                'status'  => 'fail',
                'code'    => 400,
            );
        }
        return response()->json($data,200);
    }

    public function Attachsize(Request $request) {
       // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //Hacer la relación de articulos a la relacion articulos_talla con el atributo de cantidad
        $article = article::findOrFail($params->product_id);
        $article->sizes()->attach($params->size_id,['stock'=>$params->amount]);

        $data = array(
            'article' => $article,
            'status'  => 'success',
            'code'    => 200,
        );
        return response()->json($data, 200);
    }

    public function showEditP($id) {
        $article = article::all();
        $productCount = count($article);
        $getSizes = article::find($id)->sizes()->get();
        for ($i=0; $i < $productCount ; $i++) {
            if ($article[$i]->id = $id) {
                // obteniendo los tasks asociados al producto
                $countSize = count($article[$i]->sizes);
                if ($countSize != 0) {
                    foreach ($article[$i]->sizes as $size) {
                        // obteniendo los datos de un task específico
                        $sizeServe = $size->size;
                        $amount = $size->pivot->stock;
                    }
                } else {
                    $sizeServe = null;
                    $amount = 0;
                }
                // intentar traer el blob desde el controller
                $contents = Storage::get($article[$i]->photo);
                $article[$i]->photo = base64_encode($contents);
                $article[$i]->photo = 'data:image/jpeg;base64,' . base64_encode($contents);
                return response()->json(array(
                    'products' => $article,
                    'amount'  => $amount,
                    'getSizes' => $getSizes,
                    'size'    => $sizeServe
                ), 200);
            }
        }
    }

    public function showSizeP(){
        $article = article::all();
        $productCount = count($article);
        for ($i=0; $i < $productCount ; $i++) {
            //obteniendo los tasks asociados al producto
            foreach ($article[$i]->sizes as $size) {
                //obteniendo los datos de un task específico
                $sizeServe = $size->size;
                $amount = $size->pivot->stock;
            }
            //intentar traer el blob desde el controller
            $contents = Storage::get($article[$i]->photo);
            $article[$i]->photo = base64_encode($contents);
            $article[$i]->photo = 'data:image/jpeg;base64,' . base64_encode($contents);
        }
        return response()->json(array(
            'products' => $article,
            'amount'  => $amount,
            'size'    => $sizeServe
        ), 200);
    }

    public function detachIproduct($idProduct) {
        $detachApar = DB::table('apart_article')->where('article_id', $idProduct)->get();
        $detachbilling = DB::table('article_billing')->where('article_id', $idProduct)->get();
        $detachPurchase = DB::table('article_purchase')->where('article_id', $idProduct)->get();
        $countApar = count($detachApar);
        $countPurchase = count($detachPurchase);
        $countBilling = count($detachbilling);
        if ($countApar > 0) {
            for ($i=0; $i < $countApar; $i++) {
                $apart = apart::findOrFail($detachApar[$i]->apart_id);
                $apart->articles()->wherePivot('apart_id', $detachApar[$i]->apart_id)->detach();
            }
        }
        if ($countPurchase > 0) {
            for ($i=0; $i < $countPurchase; $i++) {
                $purchase = purchase::findOrFail($detachPurchase[$i]->purchase_id);
                $purchase->articles()->wherePivot('purchase_id', $detachPurchase[$i]->purchase_id)->detach();
            }
        }
        if ($countBilling > 0) {
            for ($i=0; $i < $countBilling; $i++) {
                $billing = billing::findOrFail($detachbilling[$i]->billing_id);
                $billing->articles()->wherePivot('billing_id', $detachbilling[$i]->billing_id)->detach();
            }
        }
        return response()->json(array(
            'mgs' => 'clean relations',
        ), 200);
    }

    public function detachSize($id){
        //delete the relationships with first.
        $this->detachIproduct($id);
        $article = article::findOrFail($id);
        $article->sizes()->detach();
        //Borrar registro
        $route = public_path().'\catalogo'.'\/';
        $imgRoute = str_replace('/', '', $route);
        $imgRoute = $imgRoute . $article->photo;
        Storage::delete($article->photo);
        $article->delete();
        // return
        $data = array(
            'article' => $article,
            'status'  => 'Delete success',
            'responseDetach' => $this->detachIproduct($id),
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function detachRelation(Request $request){
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        $article = article::findOrFail($params->article_id);
        $article->sizes()->detach($params->size_id);
        $data = array(
            'article' => $article,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}

