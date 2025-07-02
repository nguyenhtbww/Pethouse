<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'ma_tai_khoan'=>$this->Mataikhoan,
            'ten_tai_khoan'=>$this->Hovaten,
            'so_dien_thoai'=>$this->SDT,
            'email'=>$this->Email,
            'thu_cung'=>$this->ThuCung,
            'dia_chi'=>$this->DiaChi,
            'quyen'=>$this->Quyen,
            'ngay_tao' => $this->created_at ? $this->created_at->format('d/m/Y') : null,
            'ngay_cap_nhat' => $this->updated_at ? $this->updated_at->format('d/m/Y') : null,
            ];
    }
}
