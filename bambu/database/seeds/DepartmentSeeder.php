<?php

use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('department')->insert([
            'id' => '1',
            'positionDpt' => '1',
            'img' => 'assets/Images/view_categorias/caballeros/40d70506-41d1-4e13-ba4c-252d2fe20c91.jpg',
            'department' => 'Pantalones',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '2',
            'positionDpt' => '2',
            'img' => 'assets/Images/view_categorias/caballeros/6423fbd6-bb1c-4c2b-a9d4-ddbf4faf54a9.jpg',
            'department' => 'Jeans',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '3',
            'positionDpt' => '3',
            'img' => 'assets/Images/view_categorias/caballeros/3786b18a-7c17-44f4-91dc-402a89e448e3.jpg',
            'department' => 'Camisas',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '4',
            'positionDpt' => '4',
            'img' => 'assets/Images/default.jpg',
            'department' => 'Short',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '5',
            'positionDpt' => '5',
            'img' => 'assets/Images/view_categorias/caballeros/ab22547f-d371-4af4-9ff0-c223de16f027.jpg',
            'department' => 'Camisetas',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '6',
            'positionDpt' => '6',
            'img' => 'assets/Images/view_categorias/caballeros/a8732877-3c42-4321-ac88-4a3175b398f7.jpg',
            'department' => 'Abrigos',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '7',
            'positionDpt' => '7',
            'img' => 'assets/Images/view_categorias/caballeros/e11b3749-0cba-4bc2-a9af-c301255f1a5f.jpg',
            'department' => 'Accesorios',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '8',
            'positionDpt' => '8',
            'img' => 'assets/Images/default.jpg',
            'department' => 'Gorras',
            'gender_id' => '1'
        ]);

        DB::table('department')->insert([
            'id' => '9',
            'positionDpt' => '9',
            'img' => 'assets/Images/view_categorias/caballeros/e47fe4d4-8d2e-4bc2-b510-6d61f271c1c9.jpg',
            'department' => 'Zapatos',
            'gender_id' => '1'
        ]);







        DB::table('department')->insert([
            'id' => '10',
            'positionDpt' => '1',
            'img' => 'assets/Images/view_categorias/damas/449daf39-c4d4-4eae-b786-e71924e800b0.jpg',
            'department' => 'Blusas',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '11',
            'positionDpt' => '2',
            'img' => 'assets/Images/view_categorias/damas/384423a9-6898-42be-b2e1-993e2f448e57.jpg',
            'department' => 'Shorts',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '12',
            'positionDpt' => '3',
            'img' => 'assets/Images/view_categorias/damas/9ac020f5-c30c-42dd-aa05-60ebc6688d2f.jpg',
            'department' => 'Enaguas',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '13',
            'positionDpt' => '4',
            'img' => 'assets/Images/view_categorias/damas/2c9afea8-39dc-4be1-832f-f49dbd093871.jpg',
            'department' => 'Conjuntos',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '14',
            'positionDpt' => '5',
            'img' => 'assets/Images/view_categorias/damas/e3afcca8-07fa-4445-ae83-b9394ef3daec.jpg',
            'department' => 'Pantalones de tela',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '15',
            'positionDpt' => '6',
            'img' => 'assets/Images/view_categorias/damas/abad6ad4-b792-43af-96c7-4c2c2ca878ae.jpg',
            'department' => 'Jeans',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '16',
            'positionDpt' => '7',
            'img' => 'assets/Images/view_categorias/damas/bb791fa4-31e4-4499-80fc-8259eb5f8e87.jpg',
            'department' => 'Ropa Interior y Lencería',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '17',
            'positionDpt' => '8',
            'img' => 'assets/Images/view_categorias/damas/abd0b4b2-f1da-48b2-9f21-cfbc98e8e539.jpg',
            'department' => 'Vestidos de baño',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '18',
            'positionDpt' => '9',
            'img' => 'assets/Images/view_categorias/damas/c1d3a2c4-fb6f-4037-bcc0-e40f2aeb8c71.jpg',
            'department' => 'Salidas de playa',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '19',
            'positionDpt' => '10',
            'img' => 'assets/Images/view_categorias/damas/9dc37ec1-23d8-4a5e-ae49-c187cc627888.jpg',
            'department' => 'Abrigos y sacos',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '20',
            'positionDpt' => '11',
            'img' => 'assets/Images/view_categorias/damas/f7bfc555-5c75-4348-9a01-e711d525aa1b.jpg',
            'department' => 'Pijamas',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '21',
            'positionDpt' => '12',
            'img' => 'assets/Images/view_categorias/damas/51801927-9b3c-4d9f-ba0d-d0e88a879c66.jpg',
            'department' => 'Accesorios',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '22',
            'positionDpt' => '13',
            'img' => 'assets/Images/view_categorias/damas/6c30df1e-297d-41c7-a0b7-996505333408.jpg',
            'department' => 'Camisetas',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '23',
            'positionDpt' => '14',
            'img' => 'assets/Images/view_categorias/damas/90c90253-04e3-46ba-b912-e6f32e788f4a.jpg',
            'department' => 'Enterizos',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '24',
            'positionDpt' => '15',
            'img' => 'assets/Images/view_categorias/damas/d0852a3b-fdc8-4a6e-9a86-447c6c764953.jpg',
            'department' => 'Overol',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '25',
            'positionDpt' => '16',
            'img' => 'assets/Images/default.jpg',
            'department' => 'Sueters',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '26',
            'positionDpt' => '17',
            'img' => 'assets/Images/view_categorias/damas/25760660-8992-49bd-9f60-0e5249a9352c.jpg',
            'department' => 'Joyería',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '27',
            'positionDpt' => '18',
            'img' => 'assets/Images/view_categorias/damas/11e80d03-e9e0-4811-a8b5-132a35ef6152.jpg',
            'department' => 'Vestidos',
            'gender_id' => '2'
        ]);

        DB::table('department')->insert([
            'id' => '28',
            'positionDpt' => '19',
            'img' => 'assets/Images/view_categorias/damas/03c0995c-d746-410c-b003-ec48527b34f4.jpg',
            'department' => 'Zapatos',
            'gender_id' => '2'
        ]);






        DB::table('department')->insert([
            'id' => '29',
            'positionDpt' => '1',
            'img' => 'assets/Images/view_categorias/niños/7ce9323e-a4ee-47e8-b4cb-3d47f9953c21.jpg',
            'department' => 'Mamelucos',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '30',
            'positionDpt' => '2',
            'img' => 'assets/Images/view_categorias/niños/b5e6814c-f432-4dcf-886a-5c167e355d63.jpg',
            'department' => 'Accesorios',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '31',
            'positionDpt' => '3',
            'img' => 'assets/Images/view_categorias/niños/08a2c652-c2f9-4786-8894-8bb984bc7d5a.jpg',
            'department' => 'Camisetas',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '32',
            'positionDpt' => '4',
            'img' => 'assets/Images/view_categorias/niños/ff022b5e-6153-4c7d-9160-2e70aa7aeed1.jpg',
            'department' => 'Camisas',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '33',
            'positionDpt' => '5',
            'img' => 'assets/Images/view_categorias/niños/0352eadd-dbb4-416b-bad8-b3d7311325a5.jpg',
            'department' => 'Shorts',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '34',
            'positionDpt' => '6',
            'img' => 'assets/Images/view_categorias/niños/872778b2-ec60-4187-9962-7cad89968b56.jpg',
            'department' => 'Conjuntos',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '35',
            'positionDpt' => '7',
            'img' => 'assets/Images/view_categorias/niños/132b3d5d-f728-4869-a1fd-3f0889ae7694.jpg',
            'department' => 'Pijamas',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '36',
            'positionDpt' => '8',
            'img' => 'assets/Images/view_categorias/niños/ab1d53a6-96b5-4e2f-a0d2-c025c9a423b1.jpg',
            'department' => 'Pantalones',
            'gender_id' => '3'
        ]);

        DB::table('department')->insert([
            'id' => '37',
            'positionDpt' => '9',
            'img' => 'assets/Images/view_categorias/niños/6ef6cb0a-24b2-41f6-acae-4281e2f0538f.jpg',
            'department' => 'Abrigos',
            'gender_id' => '3'
        ]);







        DB::table('department')->insert([
            'id' => '38',
            'positionDpt' => '1',
            'img' => 'assets/Images/view_categorias/niñas/b0bf3e70-626c-41c3-8fd0-d3a11891aaf6.jpg',
            'department' => 'Mamelucos',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '39',
            'positionDpt' => '2',
            'img' => 'assets/Images/view_categorias/niñas/5816ed8f-41ff-4eca-bd12-aecf84ad39b5.jpg',
            'department' => 'Accesorios',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '40',
            'positionDpt' => '3',
            'img' => 'assets/Images/view_categorias/niñas/6d4a4903-beff-4653-8a12-64a538fa7e4c.jpg',
            'department' => 'Blusas',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '41',
            'positionDpt' => '4',
            'img' => 'assets/Images/view_categorias/niñas/a07e11b7-93ea-4b1d-9721-16f0299a722c.jpg',
            'department' => 'Abrigos',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '42',
            'positionDpt' => '5',
            'img' => 'assets/Images/view_categorias/niñas/e379f010-dbd5-4aeb-9124-fe5ea97c7c0a.jpg',
            'department' => 'Shorts',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '43',
            'positionDpt' => '6',
            'img' => 'assets/Images/view_categorias/niñas/8aa76bd5-ce93-4636-b6bf-80e491fa702a.jpg',
            'department' => 'Enaguas',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '44',
            'positionDpt' => '7',
            'img' => 'assets/Images/view_categorias/niñas/ddfc4c8c-7c80-42c8-ba81-00296844e9be.jpg',
            'department' => 'Conjuntos',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '45',
            'positionDpt' => '8',
            'img' => 'assets/Images/view_categorias/niñas/4f1f3e34-6f4d-4f9d-9290-590d0135a452.jpg',
            'department' => 'Vestidos',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '46',
            'positionDpt' => '9',
            'img' => 'assets/Images/view_categorias/niñas/29ec1ca1-bf9f-42b6-b85e-bc3e03639819.jpg',
            'department' => 'Overol',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '47',
            'positionDpt' => '10',
            'img' => 'assets/Images/view_categorias/niñas/91e672f1-c434-43d9-9306-9dbf5c890548.jpg',
            'department' => 'Enterizos',
            'gender_id' => '4'
        ]);

        DB::table('department')->insert([
            'id' => '48',
            'positionDpt' => '11',
            'img' => 'assets/Images/view_categorias/niñas/47564463-687f-4558-bb61-3310ee8027b7.jpg',
            'department' => 'Pijamas',
            'gender_id' => '4'
        ]);
    }
}
