<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    use HasFactory;

     /**
     * Tên bảng trong cơ sở dữ liệu
     * @var string
     */
    protected $table = 'don_hang';

    /**
     * Khóa chính của bảng
     * @var string
     */
    protected $primaryKey = 'MaDH';

    /**
     * Các thuộc tính có thể gán giá trị hàng loạt
     * @var array
     */
    protected $fillable = [
        'Mataikhoan',
        'TongTien',
        'Discount',
        'SoLuong',
        'Ten',
        'SDT',
        'DiaChi',
        'PTTT',
        'GhiChu',
        'TrangThai',
        'NgayDat',
        'NgayGiao',
        'Loai',
    ];
    public function orderDetails()
    {
        return $this->hasMany(ChiTietDonHang::class, 'MaDH', 'MaDH'); // Điều chỉnh tên cột cho đúng với tên bảng
    }
    /**
     * Định nghĩa quan hệ với model User (belongsTo)
     * Một đơn hàng thuộc về một người dùng
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function user()
    {
        return $this->belongsTo(User::class, 'Mataikhoan', 'Mataikhoan');
    }
}
