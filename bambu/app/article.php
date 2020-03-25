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
        'gender',
        'tags_id'
    ];

    //relations

    public function purchases()
    {
    	return $this->belongsToMany('App\purchase')->withPivot('size', 'amount');
    }

    public function aparts()
    {
    	return $this->belongsToMany('App\apart')->withPivot('size', 'amount');
    }

    public function billing()
    {
    	return $this->belongsToMany('App\billing')->withPivot('size', 'amount');
    }

    public function outfits()
    {
        return $this->belongsToMany('App\outfit','article_outfit');
    }

    public function image()
    {
    	return $this->hasMany('app/image');
    }

    public function offers()
    {
    	return $this->hasMany('app/offer');
    }

    public function sizes()
    {
        return $this->belongsToMany('App\size','article_size')->withPivot('stock');
    }

    public function tags()
    {
    	return $this->belongsTo('app/tag', 'tags_id');
    }
}
