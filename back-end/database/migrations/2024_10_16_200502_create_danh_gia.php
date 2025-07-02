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
        Schema::create('danh_gia', function (Blueprint $table) {
            $table->id('MaDanhGia'); // Khóa chính
            $table->unsignedBigInteger('Mataikhoan')->nullable(); // Khóa ngoại đến bảng TaiKhoan, cho phép null
            $table->unsignedBigInteger('MaSP')->nullable(); // Khóa ngoại đến bảng SanPham, cho phép null
            $table->string('Ten')->nullable(); // Cho phép null
            $table->text('NoiDung')->nullable(); // Cho phép null
            $table->integer('SoSao');
            $table->date('NgayDG'); // Kiểu dữ liệu DATE
            $table->timestamps(); // Tự động tạo cột created_at và updated_at
            // Định nghĩa khóa ngoại
            $table->foreign('Mataikhoan')->references('Mataikhoan')->on('users');
            $table->foreign('MaSP')->references('MaSP')->on('san_pham'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gia');
    }
};
