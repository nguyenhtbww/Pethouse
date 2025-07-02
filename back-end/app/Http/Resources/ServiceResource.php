<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'ma_dich_vu'=>$this->MaSP,
            'ma_danh_muc'=>$this->MaDanhMuc,
            'ten_dich_vu'=>$this->TenSanPham,
            'tenDM' => $this->danhMuc->TenDM ?? 'Không có danh mục',
            'gia'=>$this->GiaSP,
            'giam_gia'=>$this->GiamGia,
            'mo_ta'=>$this->MoTa,
            'hinh_anh'=>$this->HinhAnh,
            'luot_xem'=>$this->LuotXem,
            'thoi_gian'=>$this->ThoiGian,
            'trang_thai'=>$this->TrangThai,
            'loai'=>$this->Loai,
            'ngay_tao'=>$this->created_at->format('d/m/Y'),
            'ngay_cap_nhat'=>$this->updated_at->format('d/m/Y'),
            ];
    }
}
