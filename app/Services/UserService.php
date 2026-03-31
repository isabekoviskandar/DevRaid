<?php

namespace App\Services;

use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function getUser()
    {
        $user = Auth::user();

        $user->load('links');

        return response()->json($user);
    }

    public function storePhoto($photo)
    {
        return $photo->store('users', 'public');
    }

    public function updateUser(UpdateUserRequest $updateUserRequest)
    {
        Log::info($updateUserRequest->all());
        $data = $updateUserRequest->validated();

        $user = Auth::user();

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        if ($updateUserRequest->hasFile('photo')) {
            $data['photo'] = $this->storePhoto($updateUserRequest->file('photo'));
        }

        $user->update($data);
        $user->refresh();

        return response()->json($user);
    }
}
