<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use App\client;
use App\article;
use App\billing;

class billingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       //listado de las compras del cliente
        $billing = billing::all();
        return response()->json(array(
            'billing' => $billing,
            'status'   => 'success'
        ), 200);
    }

    public function getBilling($idBilling) {
        $billingClient = DB::table('billing')->where('id', $idBilling)->first();
        $arrayBilling = billing::find($billingClient->id)->articles()->get();
        $countBilling = count($arrayBilling);
        return $arrayBilling;
        for ($i=0; $i < $countBilling; $i++) {
            $contents = Storage::get($arrayBilling[$i]->photo);
            $arrayBilling[$i]->photo = base64_encode($contents);
        }
        $data = array(
            'billing'       => $arrayBilling,
            'billingPrice'  => $billingClient->price,
            'billingId'     => $billingClient->id,
            'status'         => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);
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
            $billing = new billing();
            //validación
            $validate = Validator::make($paramsArray, [
                'price'         => 'required',
                'client'        => 'required',
                'email'         => 'required',
                'phone'         => 'required',
                'address'       => 'required',
                'addressDetail' => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $isset_billing = DB::table('billing')->where('phone', $params->phone)->get();
            $countPurchase = count($isset_billing);
            if ($countPurchase == 0) {
                $billing->client = $params->client;
                $billing->price = $params->price;
                $billing->email = $params->email;
                $billing->phone = $params->phone;
                $billing->address = $params->address;
                $billing->addressDetail = $params->addressDetail;
                $billing->status = $params->status;
                $billing->save();
                $data = array(
                    'billing'   => $billing,
                    'status'     => 'success',
                );
            } else {
                $getBilling = billing::where('phone', $params->phone)->first();
                $data = array(
                    'billing'   => $getBilling,
                    'status'     => 'Exist',
                );
            }
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

    public function attachArrayBilling($idBilling, Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //Hacer la relación del articulo con la compra con el atributo de cantidad y talla
            $billing = billing::findOrFail($idBilling);
            $billing->articles()->attach($params->article_id,['amount'=>$params->amount,
            'size'=>$params->size]);
            $data = array(
                'billing' => $billing,
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

    public function attachProductBilling(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //Hacer la relación del articulo con la compra con el atributo de cantidad y talla
            $billing = billing::findOrFail($params->billing_id);
            $billing->articles()->
            attach($params->article_id,['amount'=>$params->amount, 'size'=>$params->size]);

            $data = array(
                'billing' => $billing,
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

    public function dettachProductBilling(Request $request) {
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        //validación
        $validate = Validator::make($paramsArray, [
            'billing_id'   => 'required',
            'article_id'    => 'required'
        ]);
        if ($validate->fails()) {
            return response()->json($validate->errors(),400);
        }
        $billing = billing::findOrFail($params->billing_id);
        $billing->articles()->wherePivot('size', '=', $params->size)->detach($params->article_id);
        $data = array(
            'billing' => $billing,
            'IdBilling' => $params->billing_id,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editBilling(Request $request)
    {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);
            //validacion
            $validate = Validator::make($paramsArray, [
                'price'         => 'required',
                'client'        => 'required',
                'email'         => 'required',
                'phone'         => 'required',
                'address'       => 'required',
                'addressDetail' => 'required',
                'status'        => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            unset($paramsArray['id']);
            unset($paramsArray['created_at']);
            $billing = billing::where('id', $params->id)->update($paramsArray);
            $data = array(
                'billing' => $billing,
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
