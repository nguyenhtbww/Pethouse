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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã giảm giá
            $table->enum('type', ['percentage', 'fixed'])->default('percentage'); // Loại giảm giá
            $table->decimal('value', 10, 2); // Giá trị giảm giá
            $table->decimal('min_order_value', 10, 2)->nullable(); // Giá trị đơn hàng tối thiểu
            $table->date('expiry_date')->nullable(); // Hạn sử dụng
            $table->integer('usage_limit')->nullable(); // Số lần sử dụng tối đa
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
