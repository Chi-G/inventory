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
        // 1. Permissions & Roles
        $this->call(AuthorizationSeeder::class);

        // 2. Super Admin
        User::firstOrCreate(
            ['email' => 'admin@elevate.com'],
            [
                'name' => 'Super Admin',
                'role' => 'Super Admin',
                'password' => bcrypt('password123')
            ]
        );

        // Admin
        User::firstOrCreate(
            ['email' => 'general@elevate.com'],
            [
                'name' => 'General Admin',
                'role' => 'Admin',
                'password' => bcrypt('password123')
            ]
        );

        // Manager
        User::firstOrCreate(
            ['email' => 'manager@elevate.com'],
            [
                'name' => 'Stock Manager',
                'role' => 'Manager',
                'password' => bcrypt('password123')
            ]
        );

        // Staff
        User::firstOrCreate(
            ['email' => 'staff@elevate.com'],
            [
                'name' => 'Inventory Staff',
                'role' => 'Staff',
                'password' => bcrypt('password123')
            ]
        );
    }
}
