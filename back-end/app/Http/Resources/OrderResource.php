<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'ma_don_hang'=>$this->MaDH,
            'ma_tai_khoan'=>$this->Mataikhoan,
            'tong_tien'=>$this->TongTien,
            'giam_gia'=>$this->Discount,
            'so_luong'=>$this->SoLuong,
            'ho_ten'=>$this->Ten,
            'so_dien_thoai'=>$this->SDT,
            'dia_chi'=>$this->DiaChi,
            'phuong_thuc_tt'=>$this->PTTT,
            'ghi_chu'=>$this->GhiChu,
            'trang_thai'=>$this->TrangThai,
            'ngay_dat'=>$this->NgayDat,
            'ngay_giao'=>$this->NgayGiao,
            'Loai'=>$this->Loai,
            ];
    }
}
