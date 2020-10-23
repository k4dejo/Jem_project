<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    protected $table = "gender";
    protected $fillable = ['gender'];

    //relations

    public function Department()
    {
        return $this->hasMany(Department::class);
    }

    public function articles()
    {
    	return $this->hasMany('App\article', 'tags_id');
    }
}
