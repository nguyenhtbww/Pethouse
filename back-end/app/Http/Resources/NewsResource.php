<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'bai_viet'=>$this->id,
            'ma_tai_khoan'=>$this->Mataikhoan,
            'ma_danh_muc_bv'=>$this->MaDMBV,
            'tieu_de'=>$this->TieuDe,
            'Hinh'=>$this->Hinh,
            'noi_dung'=>$this->NoiDung,
            'chi_tiet'=>$this->ChiTiet,
            'luot_xem'=>$this->LuotXem,
            'binh_luan'=>$this->BinhLuan,
            'trang_thai'=>$this->TrangThai,
            'ngay_tao' => $this->created_at ? $this->created_at->format('d/m/Y') : null,
            'ngay_cap_nhat' => $this->updated_at ? $this->updated_at->format('d/m/Y') : null,
            ];
    }
}
