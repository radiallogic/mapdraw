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

Route::resource('kitlists', 'api\KitListsController');
Route::resource('places', 'api\PlacessController');
Route::resource('routes', 'api\RoutesController');
Route::resource('trips', 'api\TripsController');
Route::resource('vehicles', 'api\VehiclesController');
Route::resource('users', 'api\UsersController');
