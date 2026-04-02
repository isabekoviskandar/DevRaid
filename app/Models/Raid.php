<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Raid extends Model
{
    protected $fillable =
        [
            'name',
            'description',
            'slug',
            'created_user_id',
            'status',
            'required_soft_skills',
            'required_hard_skills',
            'required_personality_type',
        ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'raid_users', 'raid_id', 'user_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($raid) {
            $slug = Str::slug($raid->name);
            $count = Raid::where('slug', 'like', $slug.'%')->count();
            $raid->slug = $count ? "{$slug}-{$count}" : $slug;
        });
    }
}
