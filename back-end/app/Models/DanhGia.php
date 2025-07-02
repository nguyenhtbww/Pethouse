<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DanhGia extends Model
{
    use HasFactory;

    protected $table = 'danh_gia';

    /**
     * Khóa chính của bảng
     * @var string
     */
    protected $primaryKey = 'MaDanhGia';

    /**
     * Các thuộc tính có thể gán giá trị hàng loạt
     * @var array
     */
    protected $fillable = [
        'MaTaiKhoan', // Khóa ngoại đến bảng users
        'MaSP', // Khóa ngoại đến bảng san_pham
        'Ten', // Tên người đánh giá (có thể null)
        'NoiDung', // Nội dung đánh giá (có thể null)
        'SoSao', // Số sao đánh giá
        'NgayDG', // Ngày đánh giá
    ];

    /**
     * Định nghĩa quan hệ với model User (belongsTo)
     * Một đánh giá thuộc về một người dùng
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'MaTaiKhoan', 'MaTaiKhoan');
    }

    /**
     * Định nghĩa quan hệ với model SanPham (belongsTo)
     * Một đánh giá thuộc về một sản phẩm
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'MaSP', 'MaSP');
    }
}
