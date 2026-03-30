// tests/Unit/UserTest.php
<?php

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

it('has correct fillable attributes', function () {
    $user = new User;
    expect($user->getFillable())->toBe([
        'username', 'email', 'password', 'photo', 'bio',
        'status', 'gender', 'first_name', 'last_name',
        'date_of_birth', 'role', 'type',
    ]);
});

it('has correct hidden attributes', function () {
    $user = new User;
    expect($user->getHidden())->toBe(['password', 'remember_token']);
});

it('has correct casts', function () {
    $user = new User;
    expect($user->getCasts())
        ->toHaveKey('email_verified_at')
        ->toHaveKey('password');
});

it('uses factory', function () {
    expect(User::factory())->toBeInstanceOf(
        Factory::class
    );
});
