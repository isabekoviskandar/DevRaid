<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'raid_id',
        'assigned_to',
        'created_user_id',
        'status',
        'title',
        'description',
        'photo',
        'deadline',
    ];

    public function raid(): BelongsTo
    {
        return $this->belongsTo(Raid::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }
}
