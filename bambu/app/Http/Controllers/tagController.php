<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\article;
use App\tag;

class tagController extends Controller
{
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
                'name'          => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            $tag = new tag();
            $tag->name = $params->name;
            $tag->save();
            $data = array(
                'tag' => $tag,
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

    public function index()
    {
        $tag = tag::all();
        $data = array(
            'tag' => $tag,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }

    public function getTagsForDeparment($gender, $dpt) {
        /*$filter = tag::whereHas('articles', function($q) use ($gender, $dpt) {
            $q->where('gender', '=', $gender)->where('department', '=', $department);
        })->get();*/
        $filter = tag::all()->articles();
        $countFilter = count($filter);
        if ($countFilter > 0) {
            return response()->json(array(
                'getTagDeparment' => $filter,
                'count' => $countFilter,
                'status'   => 'success'
            ), 200);
        } else {
            return response()->json(array(
                'getTagDeparment' => $filter,
                'count' => $countFilter,
                'status'   => 'void'
            ), 200);
        }
    }

    public function getTagName(Request $request) {
        // recoger datos del POST
        $json =  $request->input('json', null);
        $params = json_decode($json);
        $paramsArray = json_decode($json,true);
        $tag = tag::where('name', '=', $params->name)->first();
        if ($tag != null) {
            $data = array(
                'tag' => $tag,
                'status'  => 'success'
            );
        } else {
            $data = array(
                'tag' => $tag,
                'status'  => 'fail'
            );
        }
        return response()->json($data, 200);
    }

    public function deleteTag($id) {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        $data = array(
            'tag' => $tag,
            'status'  => 'Delete success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
