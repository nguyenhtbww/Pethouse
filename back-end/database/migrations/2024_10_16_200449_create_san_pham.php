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
        Schema::create('san_pham', function (Blueprint $table) {
            $table->id('MaSP'); // Khóa chính
            $table->unsignedBigInteger('MaDanhMuc'); // Khóa ngoại đến bảng DanhMuc
            $table->string('TenSanPham');
            $table->integer('GiaSP'); // Giá sản phẩm kiểu số nguyên
            $table->integer('GiamGia')->nullable(); // Giảm giá, cho phép null
            $table->text('MoTa');
            $table->integer('SoLuong');
            $table->string('HinhAnh');
            $table->integer('LuotXem')->default(0);
            $table->integer('LuotBan')->default(0);
            $table->timestamp('ThoiGian')->nullable(); // Cho phép null
            $table->string('TrangThai');
            $table->string('Loai');
            $table->timestamps(); // Tự động tạo cột created_at và updated_at

            // Định nghĩa khóa ngoại
            $table->foreign('MaDanhMuc')->references('MaDanhMuc')->on('danh_muc');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('san_pham');
    }
};
