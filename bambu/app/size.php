<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class size extends Model
{
	protected $table = "size";
    protected $fillable = [
        'size',
        'stock'
    ];

    //relations
    public function articles()
    {
    	return $this->belongsToMany('App\article','article_size')->withPivot('stock');
    }
}
