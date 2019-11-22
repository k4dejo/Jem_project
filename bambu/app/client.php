<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class client extends Model
{
	protected $table = "clients";
    protected $fillable = [
        'name',
        'password',
        'phone',
        'email',
        'address',
        'addressDetail',
        'shops_id'
    ];

    //relations

    public function shop()
    {
    	return $this->belongsTo('app/shop', 'shops_id');
    }
}
