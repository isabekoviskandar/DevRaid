<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'getUser'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('user')->group(function () {
        Route::get('auth', [UserController::class, 'getUser']);
        Route::put('update', [UserController::class, 'updateUser']);
    });
});
