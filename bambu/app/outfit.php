<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class outfit extends Model
{
	protected $table = "outfits";
    protected $fillable = ['name'];

    //relations
    public function articles()
    {
    	return $this->belongsToMany('App\article','article_outfit');
    }
}
