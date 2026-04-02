<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RaidController;
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

    Route::prefix('raids')->group(function () {
        Route::get('get-user-raids', [RaidController::class, 'getUserRaids']);
        Route::post('create', [RaidController::class, 'createRaid']);
        Route::post('invite-user/{raidId}', [RaidController::class, 'inviteUserToRaid']);
        Route::get('details/{raidId}', [RaidController::class, 'getRaidDetails']);
        Route::put('update-status/{raidId}', [RaidController::class, 'updateRaidStatus']);
        Route::delete('remove-user/{raidId}', [RaidController::class, 'removeUserFromRaid']);
        Route::post('accept-invitation/{raidId}', [RaidController::class, 'acceptRaidInvitation']);
        Route::post('reject-invitation/{raidId}', [RaidController::class, 'rejectRaidInvitation']);
        Route::get('search-suitable-users/{raidId}', [RaidController::class, 'searchSuitableUsers']);
    });
});
