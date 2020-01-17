<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class billing extends Model
{
    protected $table = "billing";
    protected $fillable = [
       'price',
       'client',
       'email',
       'phone',
       'address',
       'addressDetail',
       'status'
   ];

   public function articles()
   {
       return $this->belongsToMany('App\article')->withPivot('size', 'amount');
   }
}
