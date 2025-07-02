<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model
{
    use HasFactory;
    protected $table = 'danh_muc'; 
    protected $primaryKey = 'MaDanhMuc'; // Chỉ định khóa chính

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'TenDM',
        'parent_id',
        'loai',
    ];

    /**
     * Mối quan hệ với SanPham: Một DanhMuc có thể có nhiều SanPham
     */
    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'MaDanhMuc');
    }
}
