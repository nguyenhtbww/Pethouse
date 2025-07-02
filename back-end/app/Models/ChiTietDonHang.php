<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiTietDonHang extends Model
{
    use HasFactory;

      /**
     * Tên bảng trong cơ sở dữ liệu
     * @var string
     */
    protected $table = 'ct_don_hang';

    /**
     * Khóa chính của bảng
     * @var string
     */
    protected $primaryKey = 'MaCTDH';

    /**
     * Các thuộc tính có thể gán giá trị hàng loạt
     * @var array
     */
    protected $fillable = [
        'MaDH',
        'MaSP',
        'DonGia',
        'SoLuong',
    ];

    /**
     * Định nghĩa quan hệ với model DonHang (belongsTo)
     * Một chi tiết đơn hàng thuộc về một đơn hàng
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'MaDH', 'MaDH');
    }

    /**
     * Định nghĩa quan hệ với model SanPham (belongsTo)
     * Một chi tiết đơn hàng thuộc về một sản phẩm
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'MaSP', 'MaSP');
    }
}
