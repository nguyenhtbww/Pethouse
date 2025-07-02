<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatagoryNewsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'ma_danh_muc_BV'=>$this->MaDMBV,
            'ten_danh_muc_BV'=>$this->TenDMBV,
            'ngay_tao' => $this->created_at ? $this->created_at->format('d/m/Y') : null,
            'ngay_cap_nhat' => $this->updated_at ? $this->updated_at->format('d/m/Y') : null,
            ];
    }
}
