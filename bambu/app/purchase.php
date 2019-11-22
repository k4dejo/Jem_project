<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class purchase extends Model
{
    //
    protected $table = "purchases";
     protected $fillable = [
        'price',
        'date'
    ];

    public function client()
    {
    	return $this->belongsTo('app/client');
    }

    public function articles()
    {
        return $this->belongsToMany('App\article');
    }
}
