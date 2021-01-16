<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticleOutfit extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_outfit', function (Blueprint $table) {
            $table->bigIncrements('id')->unique();
            $table->timestamps();
            $table->bigInteger('article_id')->unsigned()->nullable()->onDelete('cascade');
            $table->bigInteger('outfit_id')->unsigned()->nullable()->onDelete('cascade');

            $table->foreign('article_id')->references('id')->on('articles');
            $table->foreign('outfit_id')->references('id')->on('outfits');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_outfit');
    }
}
