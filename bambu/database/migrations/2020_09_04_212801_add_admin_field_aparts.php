<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAdminFieldAparts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('aparts', function (Blueprint $table) {
            $table->bigInteger('admin_id')->nullable();

            $table->foreign('admin_id')->references('id')->on('admins');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('aparts', function (Blueprint $table) {
            $table->dropColumn('admin_id')->nullable();
        });
    }
}
