<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LienHe extends Model
{
    use HasFactory;
    /**
     * Tên bảng trong cơ sở dữ liệu
     * @var string
     */
    protected $table = 'lien_he';

    /**
     * Khóa chính của bảng
     * @var string
     */
    protected $primaryKey = 'MaLienHe';

    /**
     * Các thuộc tính có thể gán giá trị hàng loạt
     * @var array
     */
    protected $fillable = [
        'MaTaiKhoan',
        'TieuDe',
        'HoVaTen',
        'SoDienThoai',
        'Email',
        'NoiDung',
        'ThoiGian',
    ];

    /**
     * Định nghĩa quan hệ với model User (belongsTo)
     * Một liên hệ thuộc về một người dùng
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'MaTaiKhoan', 'MaTaiKhoan');
    }
}
