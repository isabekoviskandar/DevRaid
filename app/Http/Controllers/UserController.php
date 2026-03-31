<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getUser()
    {
        return $this->userService->getUser();
    }

    public function updateUser(UpdateUserRequest $request)
    {
        return $this->userService->updateUser($request);
    }
}
