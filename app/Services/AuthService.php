<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(array $data)
    {
        $validator = Validator::make($data, [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        if (! Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('API Token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function register(array $data)
    {
        $validator = Validator::make($data, [
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'bio' => 'required|string',
            'gender' => 'required|string',
            'soft_skills' => 'required|string',
            'hard_skills' => 'required|string',
            'personality_type' => 'required|string',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'bio' => $data['bio'],
            'gender' => $data['gender'],
            'soft_skills' => $data['soft_skills'] ?? null,
            'hard_skills' => $data['hard_skills'] ?? null,
            'personality_type' => $data['personality_type'] ?? null,
        ]);

        $token = $user->createToken('API Token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return ['message' => 'Logged out successfully'];
    }

    public function getUser()
    {
        $user = Auth::user();

        return response()->json($user);
    }
}
