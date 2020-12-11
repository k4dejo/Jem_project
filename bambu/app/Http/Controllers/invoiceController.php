<?php

namespace App\Http\Controllers;
use PDF;
use App\client;
use App\article;
use App\apart;
use App\invoice;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class invoiceController extends Controller
{
    //este archivo debe ser borrado, no es parte del proyecto
    public function createNewInvoice($idApart) { 
        $apart = apart::find( $idApart);
        $apartProducts = apart::find($idApart)->articles()->get();
        $client = client::find($apart->clients_id);
        $invoice = new invoice();
        $invoice->client = $client->name;
        $invoice->email = $client->email;
        $invoice->phone = $client->phone;
        $invoice->date = date('Y-m-d H:i:s');
        $invoice->products = $apartProducts;
        $pdf = PDF::loadView('invoice', compact('invoice'));
        // return $invoice;
        return $pdf->stream('productos.pdf');
    }
}