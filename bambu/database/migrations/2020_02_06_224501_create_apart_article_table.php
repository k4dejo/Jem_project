<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApartArticleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apart_article', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('amount');
            $table->string('size');
            $table->bigInteger('article_id')->unsigned()->nullable()->onDelete('cascade');
            $table->bigInteger('apart_id')->unsigned()->nullable()->onDelete('cascade');
            $table->timestamps();

            $table->foreign('article_id')->references('id')->on('articles');
            $table->foreign('apart_id')->references('id')->on('aparts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('apart_article');
    }
}
