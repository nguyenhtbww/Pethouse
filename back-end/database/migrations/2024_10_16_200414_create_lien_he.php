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
        Schema::create('lien_he', function (Blueprint $table) {
            $table->id('MaLienHe'); // Khóa chính
            $table->string('TieuDe');
            $table->string('HoVaTen');
            $table->string('SoDienThoai');
            $table->string('Email');
            $table->text('NoiDung');
            $table->timestamps(); // Tự động tạo cột created_at và updated_at

            // Định nghĩa khóa ngoại

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lien_he');
    }
};
