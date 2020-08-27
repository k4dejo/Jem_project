<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class offer extends Model
{
    protected $table = "offers";
    protected $fillable = [
        'name',
        'offer',
        'offerMajor',
        'offerTBoutique',
        'article_id'
    ];

    //relations
    public function articles()
    {
        return $this->belongsToMany(article::class);
    }
}
