<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Helpers\jwtAuthAdmin;
use App\coupon;
use App\Admin;

class couponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $coupon = coupon::all();
        $data = array(
            'coupon' => $coupon,
            'status'  => 'success',
            'code'    => 200 
        );
        return response()->json($data, 200); 
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

    public function getCouponName(Request $request) {
        // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        $coupon = coupon::where('name', '=', $paramsArray)->first();
        if ($coupon != null) {
            $data = array(
                'coupon' => $coupon,
                'status'  => 'success' 
            );
        } else {
            $data = array(
                'coupon' => $coupon,
                'status'  => 'fail'
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
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //validacion
            $validate = Validator::make($paramsArray, [
                'name'          => 'required',
                'discount'      => 'required',
                'expiration'    => 'required',
                'status'        => 'required',
                'adminId'       => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            if ($params->adminId == 1 ) {
                $coupon = new coupon();
                $coupon->name = $params->name;
                $coupon->discount = $params->discount;
                $coupon->expiration = $params->expiration;
                $coupon->status     = $params->status;
                $coupon->save();
                $data = array(
                    'coupon' => $coupon,
                    'status'  => 'success',
                    'code'    => 200 
                );
            } else {
                $data = array(
                    'message' => 'Acceso no autorizando',
                    'status'  => 'fail',
                    'code'    => 400 
                );
            }
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $coupon = coupon::find($id);
        return response()->json(array(
            'coupon' => $coupon,
            'status'   => 'success'
        ), 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
                'name'          => 'required',
                'discount'      => 'required',
                'expiration'    => 'required',
                'status'        => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            unset($paramsArray['id']);
            unset($paramsArray['created_at']);
            $coupon = coupon::where('id', $id)->update($paramsArray);
            $data = array(
                'coupon' => $coupon,
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $coupon = coupon::find($id);
        $coupon->delete();
        $data = array(
            'coupon' => $coupon,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
