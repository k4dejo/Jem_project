<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aparts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('price');
            $table->bigInteger('clients_id')->unsigned()->nullable()->onDelete('cascade');
            $table->timestamps();

            $table->foreign('clients_id')->references('id')->on('clients');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('aparts');
    }
}
