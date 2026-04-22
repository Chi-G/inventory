<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Super Admin
        User::firstOrCreate(
            ['email' => 'admin@elevate.com'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Super Admin',
                'role' => 'Super Admin',
                'password' => bcrypt('password123')
            ]
        );

        // Admin
        User::firstOrCreate(
            ['email' => 'general@elevate.com'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'General Admin',
                'role' => 'Admin',
                'password' => bcrypt('password123')
            ]
        );

        // Manager
        User::firstOrCreate(
            ['email' => 'manager@elevate.com'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Stock Manager',
                'role' => 'Manager',
                'password' => bcrypt('password123')
            ]
        );

        // Staff
        User::firstOrCreate(
            ['email' => 'staff@elevate.com'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Inventory Staff',
                'role' => 'Staff',
                'password' => bcrypt('password123')
            ]
        );

        // Test Admin (Timed Access)
        User::firstOrCreate(
            ['email' => 'drmally@elevate.com'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Test Admin',
                'role' => 'Admin',
                'password' => bcrypt('password123')
            ]
        );

        // 2. Permissions & Roles (and link all users)
        $this->call(AuthorizationSeeder::class);
    }
}
