<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class purchase extends Model
{
    //
    protected $table = "purchases";
     protected $fillable = [
        'client_id',
        'price',
        'status',
        'orderId',
        'addresspurchases_id'
    ];

    public function client()
    {
    	return $this->belongsTo('app/client');
    }

    public function coupon() {
        return $this->hasMany(coupon::class);
    }

    public function ticket() {
        return $this->hasOne('app/ticket');
    }

    public function articles()
    {
        return $this->belongsToMany('App\article')->withPivot('size', 'amount');;
    }

    public function address()
    {
    	return $this->hasOne('app/address', 'addresspurchases_id');
    }
}
