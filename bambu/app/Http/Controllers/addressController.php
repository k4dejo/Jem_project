<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\address;

class addressController extends Controller
{
    public function getAddressPurchase($addressId) {
        $addressPurchase = DB::table('address_purchases')->where('id', $addressId)
        ->first();
        $data = array(
            'AddressPurchase' => $addressPurchase,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function store(Request $request) {
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
                'address'          => 'required',
                'addressDetail'    => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $adressPurchases = new address();
            $adressPurchases->address = $params->address;
            $adressPurchases->addressDetail = $params->addressDetail;
            $adressPurchases->save();
            $data = array(
                'AddressPurchase' => $adressPurchases,
                'status'  => 'success',
                'code'    => 200
            );
        } else {
            //Error
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data, 200);
    }

    public function deleteAddress($id) {
        $adressPurchases = address::findOrFail($id);
        $adressPurchases->delete();
        $data = array(
            'adressPurchases' => $adressPurchases,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
