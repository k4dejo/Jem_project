<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tag extends Model
{
    protected $table = "tags";
    protected $fillable = ['name'];

    public function articles()
    {
    	return $this->hasMany('App\article', 'tags_id');
    }
}
