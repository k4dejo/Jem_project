<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class coupon extends Model
{
    protected $table = "coupons";
    protected $fillable = [
        'name',
        'discount',
        'expiration',
        'status'
    ];

    public function purchases()
    {
        return $this->belongsToMany(purchase::class);
    }
}
