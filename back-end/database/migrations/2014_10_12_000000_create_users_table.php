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
        Schema::create('users', function (Blueprint $table) {
            $table->id('Mataikhoan');
            $table->string('Hovaten');
            $table->string('SDT');
            $table->string('Email')->unique();
            $table->string('ThuCung')->nullable(); // Cho phép null
            $table->string('DiaChi');
            $table->integer ('Quyen'); // Ví dụ: 'admin', 'user', 'editor'
            $table->string('Matkhau');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
