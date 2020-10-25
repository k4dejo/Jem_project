<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = "department";
    protected $fillable = ['department', 'positioDpt', 'img', 'gender_id'];

    //relations

    public function Gender()
    {
        return $this->belongsTo(Gender::class, 'gender_id');
    }

    public function articles()
    {
    	return $this->hasMany('App\article', 'tags_id');
    }
}
