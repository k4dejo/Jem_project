<?php

use Illuminate\Database\Seeder;
use seeds\GenderSeeder;
use seeds\DepartmentSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $this->call(GenderSeeder::class);
        $this->command->info('gender table seeded!');
        $this->call(DepartmentSeeder::class);
        $this->command->info('department table seeded!');
    }
}
