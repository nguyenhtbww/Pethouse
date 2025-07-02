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
        Schema::create('danh_muc', function (Blueprint $table) {
            $table->id('MaDanhMuc');// Khóa chính
            $table->string('TenDM');
            $table->integer('parent_id')->nullable(); // Cho phép null nếu không có danh mục cha
            $table->enum('loai', ['0', '1']); // Kiểu dữ liệu enum với giá trị 0 hoặc 1
            $table->timestamps(); // Tự động tạo cột created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_muc');
    }
};
