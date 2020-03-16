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
use App\size;
use App\ticket;


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

    public function getPurchaseStatus($status) {
        $purchaseStatus = purchase::where('status', $status)->get();
        return response()->json(array(
            'purchases' => $purchaseStatus,
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

    public function getTicket($idPurchase) {
        $ticketPurchase = ticket::where('purcharse_id', $idPurchase)->first();
        $contents = Storage::get($ticketPurchase->ImgTicket);
        $ticketPurchase->ImgTicket = base64_encode($contents);
        return response()->json(array(
            'purchases' => $ticketPurchase,
            'img'       => $ticketPurchase->ImgTicket,
            'status'    => 'success'
        ), 200);
    }

    public function storeTicket(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            //recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //validación
            $validate = Validator::make($paramsArray, [
                'ticket'             => 'required',
                'purchase_id'        => 'required',
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $img =  $params->ticket;
            $img = str_replace('data:image/jpeg;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $imgName = time() . '.jpg';
            Storage::disk('local')->put($imgName, base64_decode($img));
            $ticket = new ticket();
            $ticket->ImgTicket = $imgName;
            $ticket->purcharse_id = $params->purchase_id;
            $ticket->save();
            $data = array(
                'ticket' => $ticket ,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
            // Error
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data, 200);
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
            $purchase->orderId  = \Str::random(20);
            $isset_purchase = DB::table('purchases')->where('clients_id', $params->clients_id)
            ->where('status', $params->status)->get();
            $countPurchase = count($isset_purchase);
            if ($countPurchase == 0) {
                $purchase->save();
                //$getPurchase = purchase::where('clients_id', $params->clients_id);
                $getPurchase = purchase::where('status', $params->status)->first();
                $data = array(
                    'purchase'   => $getPurchase,
                    'status'     => 'success',
                );
            } else {
                //$getPurchase = purchase::where('clients_id', $params->clients_id)->first();
                $getPurchase = purchase::where('status', $params->status)->first();
                $data = array(
                    'purchase'   => $getPurchase,
                    'status'     => 'Exist',
                );
            }
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

    public function convertHash(Request $request) {
        $hashToken = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hashToken);

        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            $time = time();
            $params->time = $time;
            $key = 'wMZ86zdzku53x76FC557t688Gup3Vag3';
            $hash = $params->order_id . '|' . $params->amount . '|'. $time . '|' . $key;
            $hashEncrypt = md5($hash);
            $key_id = '13790849';
            $procesor_id = '11442382';
            $data = array(
                'hashCredomatic' => $hashEncrypt,
                'key_id'         => $key_id,
                'processor_id'    => $procesor_id,
                'time'           => $time,
                'code'  => 200,
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

    public function editPurchaseClient($idPurchase, Request $request) {
        // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        $purchase = purchase::where('id', $idPurchase)->first();
        if ($purchase != null) {
            $adminPassUpdate = purchase::where('id', $idPurchase)
            ->update(['status' => $paramsArray]);
            $data = array(
                'article' => $purchase,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
            // Error
            $data = array(
                'message' => 'vacio',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data,200);
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
            for ($i=0; $i < $countGetProduct; $i++) {
                $arrayProduct[$i]->pivot->stock = $arrayProduct[$i]->pivot->stock - $params->pivot->amount;
                $size = size::find($arrayProduct[$i]->pivot->size_id);
                $product = article::find($arrayProduct[$i]->pivot->article_id);
                // modifica la cantidad del producto e la tabla pivote
                $product->sizes()->updateExistingPivot($size->id,['stock' => $arrayProduct[$i]->pivot->stock ]);
            }
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

    public function getProductHistory($idClient) {
        $purchaseClient = DB::table('purchases')->where('clients_id', $idClient)
        ->where('status', '!=','incomplete')->get();
        $data = array(
            'purchase'                 => $purchaseClient,
            'status'                   => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);

    }

    public function ProductListHistoryOrder($idPurchase) {
        $arrayPurchase = purchase::find($idPurchase)->articles()->get();
        $countPurchase = count($arrayPurchase);
        for ($i=0; $i < $countPurchase; $i++) {
            $contents = Storage::get($arrayPurchase[$i]->photo);
            $arrayPurchase[$i]->photo = base64_encode($contents);
        }
        $data = array(
            'productlist'                 => $arrayPurchase,
            'status'                   => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);
    }

    public function getClientInfo($idClient, $status) {
        $purchaseClient = DB::table('purchases')->where('clients_id', $idClient)
        ->where('status', $status)->first();
        $arrayPurchase = purchase::find($purchaseClient->id)->articles()->get();
        $infoClient = client::where('id', $idClient)->first();
        $countPurchase = count($arrayPurchase);
        for ($i=0; $i < $countPurchase; $i++) {
            $contents = Storage::get($arrayPurchase[$i]->photo);
            $arrayPurchase[$i]->photo = base64_encode($contents);
        }
        $data = array(
            'purchase'                 => $arrayPurchase,
            'clientName'               => $infoClient->name,
            'clientAddress'            => $infoClient->address,
            'addressDetail'            => $infoClient->addressDetail,
            'clientPhone'              => $infoClient->phone,
            'purchasePrice'            => $purchaseClient->price,
            'PurchaseShiping'          => $purchaseClient->shipping,
            'status'                   => 'success',
            'code'    => 200,
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
            'orderId'        => $purchaseClient->orderId,
            'dataPurchase'   => $purchaseClient,
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
