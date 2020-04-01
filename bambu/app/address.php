<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class address extends Model
{
    protected $table = "address_purchases";
    protected $fillable = [
        'address',
        'addressDetail'
    ];

    public function purchase()
    {
    	return $this->belongsTo('app/purchase');
    }
}
