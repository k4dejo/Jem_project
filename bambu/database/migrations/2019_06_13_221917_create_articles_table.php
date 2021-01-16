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
        Schema::dropIfExists('articles');
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
            $table->engine = 'InnoDB';
            $table->bigInteger('tags_id')->unsigned()->nullable()->onDelete('cascade');
        });

        Schema::table('articles', function($table) {
            $table->foreign('tags_id')->references('id')->on('tags');
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
