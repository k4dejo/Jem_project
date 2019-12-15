<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticleClientTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_client', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->Integer('article_id')->unsigned();
            $table->Integer('client_id')->unsigned();
            $table->timestamps();

            $table->foreign('article_id')->references('id')->on('articles');
            $table->foreign('client_id')->references('id')->on('client');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_client');
    }
}
