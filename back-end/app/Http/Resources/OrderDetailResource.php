<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MaCTDH' => $this->MaCTDH,
            'MaDH' => $this->MaDH,
            'MaSP' => $this->MaSP,
            'DonGia' => $this->DonGia,
            'SoLuong' => $this->SoLuong,
            'Ten' => $this->donHang->Ten,
            'SDT' => $this->donHang->SDT,
            'DiaChi' => $this->donHang->DiaChi,
            'PTTT' => $this->donHang->PTTT,
            'GhiChu' => $this->donHang->GhiChu,
            'TrangThai' => $this->donHang->TrangThai,
            'NgayDat' => $this->donHang->NgayDat,
            'NgayGiao' => $this->donHang->NgayGiao,
            'SanPham' => [
                'TenSP' => $this->sanPham->TenSanPham ?? null, // Tên sản phẩm
                'Gia' => $this->sanPham->GiaSP ?? null, // Giá sản phẩm
                'HinhAnh' => $this->sanPham->HinhAnh ?? null, // Hình ảnh sản phẩm
            ],
        ];
    }
}
