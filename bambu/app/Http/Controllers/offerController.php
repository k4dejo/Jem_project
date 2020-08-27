<?php

namespace App\Http\Controllers;
use Illuminate\support\Facades\Validator;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\offer;
use App\article;

use Illuminate\Http\Request;

class offerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $offer = offer::all();
        $data = array(
            'offer' => $offer,
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
                'name'              => 'required',
                'offer'             => 'required',
                'offerMajor'        => 'required',
                'offerTBoutique'    => 'required',
                'articleId'         => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $offer = new offer();
            $offer->name = $params->name;
            $offer->offer = $params->offer;
            $offer->offerMajor = $params->offerMajor;
            $offer->offerTBoutique = $params->offerTBoutique;
            $offer->article_id = $params->articleId;
            $offer->save();
            $data = array(
                'offer' => $offer,
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $offer = offer::find($id);
        return response()->json(array(
            'offer' => $offer,
            'status'   => 'success'
        ), 200);
    }

    public function validateOffer($id) {
        $productOffer = DB::table('offers')->where('article_id', $id)->first();
        return response()->json(array(
            'productOffer' => $productOffer,
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
                'name'         => 'required',
                'offer'        => 'required',
                'articleId'    => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            unset($paramsArray['id']);
            unset($paramsArray['created_at']);
            $offer = offer::where('id', $id)->update($paramsArray);
            $data = array(
                'offer' => $offer,
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
        $offer = offer::find($id);
        $offer->delete();
        $data = array(
            'offer' => $offer,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
