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

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:api');

use MongoDB\Client as Mongo;
Route::get('mongo', function(Request $request) {
    $collection = ( new Mongo('mongodb://172.17.0.1:27017') )->mydatabase->mycollection;
    return $collection->find()->toArray();
});


Route::get('/', function () {
    return view('home');
});
