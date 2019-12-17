<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

/*Route::group(['middleware' => 'cors'], function(){
    //aqui van todas las rutas que necesitan CORS 
});*/
	Route::post('register','clientController@register');
	Route::post('login','clientController@login');
	Route::post('loginAdmin','adminController@login');
	Route::post('authAdmin','adminController@AuthAdmin');
	Route::post('outfits/CrearOutfit','OutfitController@store');
	Route::post('outfits/AñadirOutfit','OutfitController@AttachOutfit');
	Route::post('size/CrearTalla','sizeController@store');
	Route::post('size/addTalla','sizeController@Attachsize');
	Route::post('contactFrm','contactController@sendEmail');
	Route::post('like', 'favoriteController@likeProduct');
	Route::post('detachLike', 'favoriteController@detachLike');
	Route::post('addMimage','imageController@store');
	Route::get('getImages/{id}','imageController@show');
	Route::get('getFavorite/{idClient}/{idProduct}','favoriteController@showlikeFocus');
	Route::get('getConcreteProduct/{id}/{gender}', 'ArticleController@getConcreteProduct');
	Route::get('getproductGender/{id}', 'ArticleController@getProductGender');
	Route::get('getTalla/{id}','sizeController@showSizeP');
	Route::get('getTallaEdit/{id}','sizeController@showEditP');
	Route::delete('deleteTalla/{id}','sizeController@detachSize');
	Route::delete('deleteImg/{id}','imageController@destroy');
	Route::delete('deleteArrayImg/{id}', 'imageController@deleteImg');
	Route::post('detachRelation', 'sizeController@detachRelation');
	Route::resource('articles','ArticleController');
