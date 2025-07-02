<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;
    protected $table = 'coupons'; 
    protected $primaryKey = 'id'; // Chỉ định khóa chính

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_value',
        'expiry_date',
        'usage_limit',
    ];


}
