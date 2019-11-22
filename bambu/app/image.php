<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class image extends Model
{
    protected $table = "images";
    protected $fillable = ['name'];

    //relations

    public function article()
    {
        return $this->belongsToMany(article::class);
    }

}