<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticleSizeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_size', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('stock');
            $table->bigInteger('article_id')->unsigned()->nullable()->onDelete('cascade');
            $table->bigInteger('size_id')->unsigned()->unsigned()->nullable()->onDelete('cascade');
            $table->timestamps();

            $table->foreign('article_id')->references('id')->on('articles');
            $table->foreign('size_id')->references('id')->on('size');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_size');
    }
}
