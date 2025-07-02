<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'ma_giam_gia'=>$this->id,
            'code'=>$this->code,
            'phan_tram'=>$this->value,
            'loai_giam'=>$this->type,
            'so_tien_nho_nhat'=>$this->min_order_value,
            'ngay_het_giam'=>$this->expiry_date,
            'so_luong'=>$this->usage_limit,
            'ngay_tao' => $this->created_at ? $this->created_at->format('d/m/Y') : null,
            'ngay_cap_nhat' => $this->updated_at ? $this->updated_at->format('d/m/Y') : null,
            ];
    }
}
