<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'username' => 'nullable|string|unique:users,username,'.$userId,
            'email' => 'nullable|email|unique:users,email,'.$userId,
            'phone' => 'nullable|string|unique:users,phone,'.$userId,
            'password' => 'nullable|string|min:8',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:12048',
            'bio' => 'nullable|string',
            'status' => 'nullable|string',
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
        ];
    }
}
