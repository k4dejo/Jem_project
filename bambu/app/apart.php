<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class apart extends Model
{
    protected $table = "aparts";
    protected $fillable = [
       'client_id',
       'admin_id',
       'price',
       'status'
   ];

   //relations
   public function client()
   {
       return $this->belongsTo('App\client');
   }

   public function articles()
   {
       return $this->belongsToMany('App\article')->withPivot('size', 'amount');
   }

   public function admin()
   {
       return $this->belongsTo('App\Admin');
   }
}
