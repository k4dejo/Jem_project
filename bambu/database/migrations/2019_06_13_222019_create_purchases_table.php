<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->bigIncrements('id')->unique();
            $table->bigInteger('price');
            $table->bigInteger('shipping');
            $table->string('status');
            $table->timestamps();
            $table->unsignedInteger('clients_id');
            $table->unsignedInteger('coupon_id');

            $table->foreign('coupon_id')->references('id')->on('coupons');
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
        Schema::dropIfExists('purchases');
    }
}
