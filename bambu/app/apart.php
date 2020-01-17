<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class apart extends Model
{
    protected $table = "aparts";
    protected $fillable = [
       'client_id',
       'price',
   ];

   //relations
   public function client()
   {
       return $this->belongsTo('app/client');
   }

   public function articles()
   {
       return $this->belongsToMany('App\article')->withPivot('size', 'amount');;
   }
}
