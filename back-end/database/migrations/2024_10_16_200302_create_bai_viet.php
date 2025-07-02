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
        Schema::create('bai_viet', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Mataikhoan'); // Khóa ngoại đến bảng TaiKhoan
            $table->unsignedBigInteger('MaDMBV'); // Khóa ngoại đến bảng DMBaiViet
            $table->string('TieuDe');
            $table->string('Hinh');
            $table->text('NoiDung');
            $table->text('ChiTiet');
            $table->integer('LuotXem')->default(0);
            $table->text('BinhLuan')->nullable();
            $table->string('TrangThai')->default('1'); // Ví dụ về trạng thái bài viết
            $table->timestamps(); // Tự động tạo cột created_at và updated_at

            // Định nghĩa khóa ngoại
            $table->foreign('Mataikhoan')->references('Mataikhoan')->on('users'); 
            $table->foreign('MaDMBV')->references('MaDMBV')->on('dm_baiviet'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bai_viet');
    }
};
