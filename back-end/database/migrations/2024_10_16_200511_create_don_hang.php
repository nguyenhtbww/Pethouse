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
        Schema::create('don_hang', function (Blueprint $table) {
            $table->id('MaDH'); // Khóa chính
            $table->unsignedBigInteger('Mataikhoan'); // Khóa ngoại đến bảng TaiKhoan
            $table->decimal('TongTien', 10, 2);
            $table->decimal('Discount', 10, 2)->default(0); // Thêm trường Discount với kiểu dữ liệu phù hợp
            $table->integer('SoLuong');
            $table->string('Ten'); // Có thể là tên người nhận
            $table->string('SDT');
            $table->string('DiaChi');
            $table->string('PTTT'); // Phương thức thanh toán
            $table->string('GhiChu')->nullable();
            $table->string('Loai');
            $table->enum('TrangThai', ['cho_xac_nhan', 'da_xac_nhan', 'dang_van_chuyen', 'da_thanh_toan', 'hoan_thanh', 'huy'])->default('cho_xac_nhan'); // Trạng thái đơn hàng
            $table->dateTime('NgayDat')->nullable();  // Ngày và giờ đặt hàng có thể để trống
            $table->dateTime('NgayGiao')->nullable(); // Ngày và giờ giao hàng có thể để trống

            $table->timestamps(); // Tự động tạo cột created_at và updated_at

            // Định nghĩa khóa ngoại
            $table->foreign('Mataikhoan')->references('Mataikhoan')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hang');
    }
};
