<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class offer extends Model
{
    protected $table = "offers";
    protected $fillable = [
        'name',
        'offer',
        'article_id'
    ];

    //relations
    public function articles()
    {
        return $this->belongsToMany(article::class);
    }
}
