<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class chartsReport extends Model
{
    protected $table = "chart_reports";
    protected $fillable = [
        'sellsOfDay',
        'date'
    ];
}
