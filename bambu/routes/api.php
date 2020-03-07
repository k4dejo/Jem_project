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

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'cors'], function(){
    //aqui van todas las rutas que necesitan CORS
});*/

   /*CLIENT*/
   Route::post('register','clientController@register');
   Route::post('login','clientController@login');
   Route::put('editClientInfo/{id}', 'clientController@editClient');
   Route::get('getClientList' , 'clientController@getClientList');
   Route::get('getClientInfo/{id}', 'clientController@getClientInfo');
   Route::get('getClientPhoto/{id}', 'clientController@getClientPhoto');
   /**/

   /*ADMIN*/
   Route::post('loginAdmin','adminController@login');
   Route::post('authAdmin','adminController@AuthAdmin');
   Route::post('verifyPassword', 'adminController@VerifyPass');
   Route::post('createNewAdmin', 'adminController@createAdmin');
   Route::delete('deleteAdmin/{id}', 'adminController@destroyAdmin');
   Route::get('getAdminList', 'adminController@getAdminList');
   Route::get('getClientPurchase/{id}', 'adminController@getClient');
   /**/

   /*OUTFIT*/
   Route::post('createOutfit','OutfitController@store');
   Route::post('attachOutfit','OutfitController@AttachOutfit');
   Route::post('deleteOutfitDetach', 'OutfitController@detachOutfits');
   Route::post('attachOutfitProduct', 'OutfitController@AttachOutfits');
   Route::put('editOutfit/{id}', 'OutfitController@editOutfit');
   Route::get('getOutfitsList', 'OutfitController@index');
   Route::get('getAttachOutfit', 'OutfitController@getOutfitProduct');
   Route::get('getOutfitAttach/{id}', 'OutfitController@showOutfitList');
   Route::delete('deleteOutfit/{id}', 'OutfitController@deleteOutfit');
   /**/

   /*SIZE*/
   Route::post('size/CrearTalla','sizeController@store');
   Route::post('size/addTalla','sizeController@Attachsize');
   Route::post('detachRelation', 'sizeController@detachRelation');
   Route::get('getTalla/{id}','sizeController@showSizeP');
   Route::get('getTallaEdit/{id}','sizeController@showEditP');
   Route::delete('deleteTalla/{id}','sizeController@detachSize');
   /**/

   /*CONTACT*/
   Route::post('contactFrm','contactController@sendEmail');
   /**/

   /*LIKE*/
   Route::post('like', 'favoriteController@likeProduct');
   Route::post('detachLike', 'favoriteController@detachLike');
   Route::get('getFavorite/{idClient}/{idProduct}','favoriteController@showlikeFocus');
   Route::get('getFavoriteList/{idClient}', 'favoriteController@showFavoriteList');
   /**/

   /*IMAGE*/
   Route::post('addMimage','imageController@store');
   Route::post('deleteArrayImg/{id}', 'imageController@deleteImg');
   Route::get('getImages/{id}','imageController@show');
   Route::delete('deleteImg/{id}','imageController@destroy');
   /**/

   /*PURCHASE*/
   Route::post('Addpurchase', 'PurchaseController@store');
   Route::post('editPurchase', 'PurchaseController@edit');
   Route::post('convertHash', 'PurchaseController@convertHash');
   Route::post('attachPurchase', 'PurchaseController@attachProductPurchase');
   Route::post('dettachProductPurchase', 'PurchaseController@dettachProductPurchase');
   Route::put('updateAmountProduct/{id}', 'PurchaseController@changeAmountProduct');
   Route::put('editPurchaseStatus/{id}', 'PurchaseController@editPurchaseClient');
   Route::get('verifyPurchaseStatus/{id}', 'PurchaseController@verifyStatusPurchase');
   Route::get('getShowProductP/{idClient}/{idProduct}',
   'PurchaseController@showSingleProductPurchase');
   Route::get('getPurchase/{id}', 'PurchaseController@getPurchase');
   Route::get('getHistoryPurchaseClient/{id}', 'PurchaseController@getProductHistory');
   Route::get('getStatusPurchase/{id}', 'PurchaseController@getPurchaseStatus');
   Route::get('getClientInfoPurchase/{id}/{status}', 'PurchaseController@getClientInfo');
   Route::get('getProductPurchaseHistory/{id}', 'PurchaseController@ProductListHistoryOrder');
   /**/

   /*BILLING*/
   Route::resource('billing', 'billingController');
   Route::post('attachBillingProduct', 'billingController@attachProductBilling');
   Route::post('detachBillingProduct', 'billingController@dettachProductBilling');
   Route::post('editBilling', 'billingController@editBilling');
   Route::get('getBillingList/{id}', 'billingController@getBilling');
   /**/

   /*APART*/
    Route::post('AddApart', 'apartController@store');
    Route::post('EditApart', 'apartController@editApart');
    Route::post('AttachApart', 'apartController@attachProductApart');
    Route::post('detachApart', 'apartController@dettachProductApart');
    Route::get('getApart/{id}', 'apartController@getApart');
    Route::get('getApartClient/{id}', 'apartController@getApartClient');
   /**/

   /*PRODUCT*/
   Route::resource('articles','ArticleController');
   Route::get('showProductSizeList/{id}' , 'ArticleController@showSizeList');
   Route::get('getConcreteProduct/{id}/{gender}', 'ArticleController@getConcreteProduct');
   Route::get('getproductGender/{id}', 'ArticleController@getProductGender');
   /**/

   /*OFFER*/
   Route::resource('offer', 'offerController');
   Route::get('getOfferProduct/{id}', 'offerController@validateOffer');
   /**/

   /*COUPON*/
   Route::resource('coupon', 'couponController');
   Route::post('getCouponClient','couponController@getCouponName');
   /**/





