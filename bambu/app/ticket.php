<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ticket extends Model
{
    protected $table = "image_ticket";
    protected $fillable = ['ImgTicket', 'purcharse_id'];

    public function purchase()
    {
        return $this->belongsTo('app\purchase');
    }
}
