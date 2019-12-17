<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->bigIncrements('id')->unique();
            $table->timestamps();
            $table->string('name');
            $table->string('detail');
            $table->bigInteger('pricePublic');
            $table->bigInteger('priceMajor');
            $table->bigInteger('priceTuB');
            $table->string('department');
            $table->decimal('weight');
            $table->string('photo'); //extension .jpg .png ..etc
            $table->boolean('gender');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
