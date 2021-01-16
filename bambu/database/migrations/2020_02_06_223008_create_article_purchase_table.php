<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlePurchaseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('article_purchase');
        Schema::create('article_purchase', function (Blueprint $table) {
            $table->bigIncrements('id')->unique();
            $table->timestamps();
            $table->bigInteger('amount');
            $table->string('size');
            $table->bigInteger('article_id')->unsigned()->nullable()->onDelete('cascade');
            $table->bigInteger('purchase_id')->unsigned()->nullable()->onDelete('cascade');

            $table->foreign('article_id')->references('id')->on('articles');
            $table->foreign('purchase_id')->references('id')->on('purchases');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_purchase');
    }
}
