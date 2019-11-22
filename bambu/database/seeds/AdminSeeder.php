<?php

use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
        	'user' => 'admin01',
            'password' => '123',
            'priority' => 'true'
        ]);
        
        DB::table('admins')->insert([
        	'user' => 'admin02',
            'password' => '123',
            'priority' => 'false'
        ]);

        DB::table('admins')->insert([
        	'user' => 'admin03',
            'password' => 'qwerty',
            'priority' => 'false'
        ]);

        DB::table('admins')->insert([
        	'user' => 'admin03',
            'password' => 'abc',
            'priority' => 'false'
        ]);
    }
}
