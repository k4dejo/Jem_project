<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImageTicketTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('image_ticket', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('ImgTicket'); //extension .jpg .png ..etc
            $table->Integer('purcharse_id')->unsigned();
            $table->timestamps();

            $table->foreign('purcharse_id')->references('id')->on('purchases')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('image_ticket');
    }
}
