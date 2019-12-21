<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class article extends Model
{
    protected $table = "articles";
    protected $fillable = [
        'name',
        'detail',
        'pricePublic',
        'priceMajor',
        'priceTuB',
        'department',
        'weight',
        'photo',
        'gender'
    ];

    //relations

    public function purchases()
    {
    	return $this->belongsToMany('App\purchase')->withPivot('size', 'amount');
    }

    public function outfits()
    {
        return $this->belongsToMany(outfit::class);
    }

    public function image()
    {
    	return $this->hasMany('app/image');
    }

    public function sizes()
    {
        return $this->belongsToMany('App\size','article_size')->withPivot('stock');
    }
}