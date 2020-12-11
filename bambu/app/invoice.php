<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class invoice extends Model
{
    protected $fillable = [
        'client',
        'date',
        'email',
        'phone',
        'shipping',
        'totalPrice',
        'products'
    ];

}
