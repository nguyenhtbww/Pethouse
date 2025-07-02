<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'ma_lien_he'=>$this->MaLienHe,
            'tieu_de'=>$this->TieuDe,
            'ho_ten'=>$this->HoVaTen,
            'loai'=>$this->SoDienThoai,
            'email'=>$this->Email,
            'noi_dung'=>$this->NoiDung,
            'ngay_tao' => $this->created_at ? $this->created_at->format('d/m/Y') : null,
            'ngay_cap_nhat' => $this->updated_at ? $this->updated_at->format('d/m/Y') : null,
            ];
    }
}
