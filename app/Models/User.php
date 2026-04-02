<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// #[Fillable(['username', 'email', 'phone', 'password', 'photo', 'bio', 'status', 'gender', 'first_name', 'last_name', 'date_of_birth', 'role', 'type'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'phone',
        'password',
        'photo',
        'bio',
        'status',
        'gender',
        'first_name',
        'last_name',
        'date_of_birth',
        'role',
        'type',
        'soft_skills',
        'hard_skills',
        'personality_type',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function links()
    {
        return $this->hasMany(UserLink::class);
    }

    public function raids()
    {
        return $this->hasMany(Raid::class, 'created_user_id');
    }

    public function raidUsers()
    {
        return $this->hasMany(RaidUser::class);
    }
}
