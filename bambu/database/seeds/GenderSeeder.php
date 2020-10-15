<?php

use Illuminate\Database\Seeder;

class GenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('gender')->insert([
        	'id' => '1',
            'gender' => 'Hombre'
        ]);

        DB::table('gender')->insert([
        	'id' => '2',
            'gender' => 'Mujer'
        ]);

        DB::table('gender')->insert([
        	'id' => '3',
            'gender' => 'Niño'
        ]);

        DB::table('gender')->insert([
        	'id' => '4',
            'gender' => 'Niña'
        ]);
    }
}
