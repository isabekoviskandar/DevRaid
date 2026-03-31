<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLink extends Model
{
    protected $fillable =
        [
            'user_id',
            'link_type',
            'link_url',
            'status',
        ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
