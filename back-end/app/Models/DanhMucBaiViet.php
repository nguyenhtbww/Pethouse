<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DanhMucBaiViet extends Model
{
    use HasFactory;
    protected $table = 'dm_baiviet';
    protected $primaryKey = 'MaDMBV'; // Chỉ định khóa chính
   
       /**
        * The attributes that are mass assignable.
        *
       
        */
       protected $fillable = [
           'TenDMBV',
       ];
    /**
     * Mối quan hệ với BaiViet: Một DanhMucBaiViet có thể có nhiều BaiViet
     */
    public function baiViets()
    {
        return $this->hasMany(BaiViet::class, 'MaDMBV');
    }
}
