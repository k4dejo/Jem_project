<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

/*Route::post('/bambu/register','clientController@register');
Route::post('/bambu/login','clientController@login');
Route::post('/bambu/loginAdmin','adminController@login');
Route::post('/bambu/outfits/CrearOutfit','OutfitController@store');
Route::post('/bambu/outfits/AñadirOutfit','OutfitController@AttachOutfit');
Route::resource('/bambu/articles','ArticleController');*/
