<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorSVG;

class BarcodeController extends Controller
{
    public function generate($value, $slug = null)
    {
        $generator = new BarcodeGeneratorSVG();
        $barcode = $generator->getBarcode($value, $generator::TYPE_CODE_128);

        return response($barcode)->header('Content-Type', 'image/svg+xml');
    }
}
