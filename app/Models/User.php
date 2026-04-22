<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /**
     * Constants for timed access restrictions
     */
    const TIMED_ACCESS_HOURS = 1;      // Max session duration
    const LOCKOUT_HOURS = 12;         // Cooldown duration after logout/timeout

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'uuid',
        'role_id',
        'access_expires_at',
        'can_login_after',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['slug'];

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

    /**
     * Check if user is Super Admin
     */
    public function isSuperAdmin()
    {
        return $this->role === 'Super Admin';
    }

    /**
     * Check if user has administrative powers
     */
    public function isAdmin()
    {
        return in_array($this->role, ['Super Admin', 'Admin']);
    }

    /**
     * Check if user is at least a Manager
     */
    public function isManager()
    {
        return in_array($this->role, ['Super Admin', 'Admin', 'Manager']);
    }

    /**
     * Boot the model to auto-generate UUID on creation
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (!$user->uuid) {
                $user->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    /**
     * Get the role-based URL slug
     */
    public function getSlugAttribute()
    {
        return \Illuminate\Support\Str::slug($this->role) . '-' . $this->uuid;
    }

    /**
     * Get the user's role relationship
     */
    public function role_relation(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permissionName): bool
    {
        if ($this->isSuperAdmin()) return true;
        
        return $this->role_relation && $this->role_relation->permissions->contains('name', $permissionName);
    }
}
