<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Roles Table
        Schema::create('roles', function (Blueprint $row) {
            $row->id();
            $row->string('name')->unique(); 
            $row->string('display_name');  
            $row->timestamps();
        });

        // 2. Permissions Table
        Schema::create('permissions', function (Blueprint $row) {
            $row->id();
            $row->string('name')->unique(); 
            $row->string('display_name');  
            $row->string('module');       
            $row->timestamps();
        });

        // 3. Pivot Table (Permission <-> Role)
        Schema::create('permission_role', function (Blueprint $row) {
            $row->foreignId('role_id')->constrained()->onDelete('cascade');
            $row->foreignId('permission_id')->constrained()->onDelete('cascade');
            $row->primary(['role_id', 'permission_id']);
        });

        // 4. Update Users Table
        Schema::table('users', function (Blueprint $row) {
            $row->foreignId('role_id')->nullable()->after('role')->constrained('roles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $row) {
            $row->dropConstrainedForeignId('role_id');
        });
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
