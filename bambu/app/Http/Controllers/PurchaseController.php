<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use App\purchase;
use App\client;
use App\article;


class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       //listado de las compras del cliente
        $purchases = purchase::all();
        return response()->json(array(
            'purchases' => $purchases,
            'status'   => 'success'
        ), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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
            $purchase = new purchase();
            //validación
            $validate = Validator::make($paramsArray, [
                'clients_id'   => 'required',
                'price'        => 'required',
                'status'         => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $purchase->clients_id = $params->clients_id;
            $purchase->price = $params->price;
            $purchase->status = $params->status;
            $purchase->coupon_id = $params->coupon_id;
            $purchase->shipping = $params->shipping;
            $isset_purchase = DB::table('purchases')->where('clients_id', $params->clients_id)
            ->where('status', $params->status)->get();
            $countPurchase = count($isset_purchase);
            if ($countPurchase == 0) {
                $purchase->save();
                $getPurchase = purchase::where('clients_id', $params->clients_id);
                $data = array(
                    'purchase'   => $getPurchase,
                    'status'     => 'success',
                );
            }
            $getPurchase = purchase::where('clients_id', $params->clients_id)->first();
            $data = array(
                'purchase'   => $getPurchase,
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

    public function attachProductPurchase(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //Hacer la relación del articulo con la compra con el atributo de cantidad y talla
            $purchase = purchase::findOrFail($params->purchase_id);
            $purchase->articles()->
            attach($params->article_id,['amount'=>$params->amount, 'size'=>$params->size]);

            $data = array(
                'article' => $purchase,
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

    public function dettachProductPurchase(Request $request) {
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //validación
        $validate = Validator::make($paramsArray, [
            'idPurchase'   => 'required',
            'idProduct'    => 'required'
        ]);
        if ($validate->fails()) {
            return response()->json($validate->errors(),400);
        }
        $purchase = purchase::findOrFail($params->idPurchase);
        $purchase->articles()->detach($params->idProduct);
        $data = array(
            'article' => $purchase,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function verifyStatusPurchase($idClient) {
        $purchaseClient = DB::table('purchases')->where('clients_id', $idClient)
        ->where('status', 'incomplete')->first();
        $data = array(
            'purchase'  => $purchaseClient,
            'status'    => 'success',
            'code'      => 200,
        );
        return response()->json($data,200);
    }

    public function getPurchase($idClient) {
        $purchaseClient = DB::table('purchases')->where('clients_id', $idClient)
        ->where('status', 'incomplete')->first();
        $arrayPurchase = purchase::find($purchaseClient->id)->articles()->get();
        $countPurchase = count($arrayPurchase);
        for ($i=0; $i < $countPurchase; $i++) {
            $contents = Storage::get($arrayPurchase[$i]->photo);
            $arrayPurchase[$i]->photo = base64_encode($contents);
        }
        $data = array(
            'purchase'       => $arrayPurchase,
            'purchasePrice'  => $purchaseClient->price,
            'purchaseId'     => $purchaseClient->id,
            'couponId'       => $purchaseClient->coupon_id,
            'shipping'       => $purchaseClient->shipping,
            'status'         => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);
    }

    public function showSingleProductPurchase($idClient, $idProduct) {
        $isset_purchase = purchase::where('clients_id', $idClient)->first();
        if ($isset_purchase != null) {
            $isset_attach = purchase::find($isset_purchase->id)->articles()->find($idProduct);
            if ($isset_attach != null) {
                $data = array(
                    'purchase' => $isset_attach,
                    'status'  => 'success',
                    'code'    => 200,
                );
            } else {
                $data = array(
                    'status'  => 'void',
                    'code'    => 200,
                );
            }
        } else {
            $data = array(
                'status'  => 'void',
                'code'    => 200,
            );
        }
        return response()->json($data,200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $purchases = purchase::find($id);
        return response()->json(array(
            'purchases' => $purchases,
            'status'   => 'success'
        ), 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request) {
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
            $purchase = purchase::where('id', $params->id)->update($paramsArray);
            $data = array(
                'purchase' => $purchase,
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

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
