<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanPham extends Model
{
    use HasFactory;
    protected $table = 'san_pham';
    protected $primaryKey = 'MaSP'; // Chỉ định khóa chính

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'MaDanhMuc',
        'TenSanPham',
        'GiaSP',
        'GiamGia',
        'MoTa',
        'SoLuong',
        'HinhAnh',
        'LuotXem',
        'LuotBan',
        'ThoiGian',
        'TrangThai',
        'Loai',
    ];

    /**
     * Mối quan hệ với DanhMuc: Một SanPham thuộc về một DanhMuc
     */
    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class, 'MaDanhMuc', 'MaDanhMuc');
    }

    /**
     * Mối quan hệ với DanhGia: Một SanPham có thể có nhiều DanhGia
     */
    public function danhGias()
    {
        return $this->hasMany(DanhGia::class, 'MaSanPham');
    }

    /**
     * Mối quan hệ với ChiTietDonHang: Một SanPham có thể nằm trong nhiều ChiTietDonHang
     */
    public function chiTietDonHangs()
    {
        return $this->hasMany(ChiTietDonHang::class, 'MaSanPham');
    }

    public static function search($keyword)
    {
        return self::where('TenSanPham', 'like', '%' . $keyword . '%')
            ->get();
    }
}
