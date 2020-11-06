<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Gender;
use Image;

class GenderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $gender = Gender::all();
        $data = array(
            'genders' => $gender,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function getGenderForId($idGender) {
        $gender = Gender::findOrFail($idGender);
        return response()->json(array(
            'gender' => $gender,
            'status' => 'success'
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
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //validacion
            $validate = Validator::make($paramsArray, [
                'gender' => 'required',
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }

            $gender = new Gender();
            if ($params->img != '') {
                $imgName = time() . $params->gender;
                $img =  $params->img;
                $img = str_replace('data:image/jpeg;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
                $base = base64_decode($img);
                $imgConvert = Image::make($base)->encode('jpg', 100);
                Storage::disk('public')->put($imgName, $imgConvert);
                $gender->img = $imgName;
            }
            $gender->gender = $params->gender;
            $gender->save();

            $data = array(
                'gender' => $gender,
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
        $gender = Gender::find($id);
        return response()->json(array(
            'gender' => $gender,
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
                'gender' => 'required',
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $lengthImg = strlen($params->img);
            $isWeb = explode('/', $params->img);
            if ($isWeb[0] == 'assets') {
                unset($paramsArray['id']);
                unset($paramsArray['created_at']);
                $gender = Gender::where('id', $id)->update($paramsArray);
            } else {
                if ($lengthImg >= 100) {
                    $img =  $params->img;
                    $imgName = time() . $params->gender;
                    $img = str_replace('data:image/jpeg;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    $base = base64_decode($img);
                    $paramsArray['img'] = $imgName;
                    $imgConvert = \Image::make($base)->encode('jpg', 100);
                    \Storage::disk('public')->put($imgName, $imgConvert);
                    unset($paramsArray['id']);
                    unset($paramsArray['created_at']);
                    $gender = Gender::where('id', $id)->update($paramsArray);
                }
            }

            $data = array(
                'gender' => $paramsArray,
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
        $gender = Gender::find($id);
        $gender->delete();
        $data = array(
            'gender' => $gender,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
