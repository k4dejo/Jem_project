<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EditGenderDepartmentRelationArticleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->bigInteger('gender_id')->unsigned()->nullable()->onDelete('cascade');
            $table->bigInteger('dpt_id')->unsigned()->nullable()->onDelete('cascade');

            $table->foreign('gender_id')->references('id')->on('gender');
            $table->foreign('dpt_id')->references('id')->on('department');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('gender_id')->nullable();
            $table->dropColumn('dpt_id')->nullable();
        });
    }
}
