<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\article;

class filtersController extends Controller {

    public function searchProduct($keyword) {
        $productFind = article::where('name', $keyword)->paginate(10);
        $data = array(
            'productFind' => $productFind,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}