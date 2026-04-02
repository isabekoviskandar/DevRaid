<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RaidUser extends Model
{
    protected $fillable =
        [
            'raid_id',
            'user_id',
            'role',
            'status',
        ];

    public function raid()
    {
        return $this->belongsTo(Raid::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
