<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaiViet extends Model
{
    use HasFactory;
    protected $table = 'bai_viet';
    protected $primaryKey = 'id'; // Chỉ định khóa chính
    protected $fillable = [
        'Mataikhoan',
        'MaDMBV',
        'TieuDe',
        'Hinh',
        'NoiDung',
        'ChiTiet',
        'LuotXem',
        'BinhLuan',
        'TrangThai',
    ];

    /**
     * Mối quan hệ với User: Một BaiViet thuộc về một User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'Mataikhoan');
    }

    /**
     * Mối quan hệ với DanhMuc: Một BaiViet thuộc về một DanhMuc
     */
    public function danhMucBV()
    {
        return $this->belongsTo(DanhMuc::class, 'MaDMBV');
    }
}
