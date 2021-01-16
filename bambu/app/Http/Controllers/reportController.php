<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use App\article;
use App\chartsReport;
use App\apart;
use App\purchase;
use Carbon\Carbon;

class reportController extends Controller
{
    public function makeReportTaks() {
        $totalAmount = 0;
        $current_time = Carbon::now()->toDateString();
        $purchases = purchase::where('status', 'Procesando')->whereDate('updated_at', $current_time)->get();
        $aparts = apart::where('status', 'completo')
        ->whereBetween('created_at', ['2021-01-06 20:40:57', $current_time])
        ->whereDate('updated_at', $current_time)->get();
        $report = new chartsReport();
        for ($i=0; $i < count($purchases); $i++) { 
            $totalAmount += $purchases[$i]->price;
        }
        for ($index=0; $index < count($aparts); $index++) { 
            $totalAmount += $aparts[$index]->price;
        }
        $report->date = $current_time;
        $report->sellsOfDay = $totalAmount;
        $report->save();
    }

    public function viewSellingReports(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            $SellingChart = chartsReport::all();
            $data = array(
                'chart'   => $SellingChart,
                'status'     => 'success',
            );
        } else {
            // Error
            $data = array(
                'message' => 'Usuario no autorizado',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data,200);
    }
}
