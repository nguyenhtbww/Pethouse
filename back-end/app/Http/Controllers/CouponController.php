<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;
use App\Http\Resources\CouponResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;


/**
 * @OA\Schema(
 *     schema="CouponResource",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="code", type="string", example="magiamgia"),
 *     @OA\Property(property="type", type="string", example="percentage"),
 *     @OA\Property(property="value", type="integer", example=20),
 *     @OA\Property(property="min_order_value", type="integer", example=100000),
 *     @OA\Property(property="expiry_date", type="string", example="2024-12-29T17:09:04Z"),
 *     @OA\Property(property="usage_limit", type="integer", example="20"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-29T17:09:04Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-10-29T17:09:04Z")
 * )
 */
class CouponController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/coupons/validate",
     *     summary="Validate a coupon code",
     *     tags={"Coupons"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"code"},
     *             @OA\Property(property="code", type="string", example="DISCOUNT10"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Valid coupon details",
     *         @OA\JsonContent(
     *             @OA\Property(property="type", type="string", example="percentage"),
     *             @OA\Property(property="value", type="number", format="float", example=10),
     *             @OA\Property(property="min_order_value", type="number", format="float", example=100)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Coupon not found",
     *         @OA\JsonContent(@OA\Property(property="error", type="string", example="Coupon not found"))
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid coupon (expired or limit exceeded)",
     *         @OA\JsonContent(@OA\Property(property="error", type="string", example="Coupon expired"))
     *     )
     * )
     */
    public function validateCoupon(Request $request)
    {
        $coupon = Coupon::where('code', $request->input('code'))->first();

        if (!$coupon) {
            return response()->json(['error' => 'Không tìm thấy mã giảm giá'], 404);
        }

        // Kiểm tra nếu mã giảm giá đã hết hạn
        if ($coupon->expiry_date && $coupon->expiry_date < now()) {
            return response()->json(['error' => 'Mã giảm giá đã hết hạn'], 400);
        }

        // Kiểm tra nếu mã giảm giá đã hết lượt sử dụng
        if ($coupon->usage_limit <= 0) {
            return response()->json(['error' => 'Mã giảm giá đã hết lượt sử dụng'], 400);
        }

        // Giảm usage_limit đi 1 khi mã giảm giá hợp lệ
        $coupon->usage_limit -= 1;

        // Lưu lại thay đổi sau khi giảm usage_limit
        $coupon->save();

        return response()->json([
            'type' => $coupon->type,
            'value' => $coupon->value,
            'min_order_value' => $coupon->min_order_value,
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/coupons/apply",
     *     summary="Apply a coupon code to calculate the discount",
     *     tags={"Coupons"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"code", "order_total"},
     *             @OA\Property(property="code", type="string", example="vi"),
     *             @OA\Property(property="order_total", type="number", format="float", example=50000),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Discount applied successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="original_total", type="number", format="float", example=200),
     *             @OA\Property(property="discount", type="number", format="float", example=20),
     *             @OA\Property(property="discounted_total", type="number", format="float", example=180)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Coupon not found",
     *         @OA\JsonContent(@OA\Property(property="error", type="string", example="Coupon not found"))
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Order total does not meet the minimum requirement",
     *         @OA\JsonContent(@OA\Property(property="error", type="string", example="Order value is less than the minimum required"))
     *     )
     * )
     */
    public function applyCoupon(Request $request)
    {
        $coupon = Coupon::where('code', $request->input('code'))->first();

        if (!$coupon) {
            return response()->json(['error' => 'Không có mã giảm giá'], 404);
        }

        // Kiểm tra nếu mã giảm giá đã hết lượt sử dụng
        if ($coupon->usage_limit <= 0) {
            return response()->json(['error' => 'Mã giảm giá đã hết lượt sử dụng'], 400);
        }

        $orderTotal = $request->input('order_total');

        if ($orderTotal < $coupon->min_order_value) {
            return response()->json(['error' => 'Giá trị đơn hàng thấp hơn mức tối thiểu yêu cầu'], 400);
        }

        // Tính toán mức giảm giá
        $discount = $coupon->type === 'percentage'
            ? $orderTotal * ($coupon->value / 100)
            : $coupon->value;

        $discountedTotal = $orderTotal - $discount;

        // Giảm usage_limit đi 1 sau khi áp dụng mã giảm giá
        $coupon->usage_limit -= 1;

        // Nếu usage_limit = 0, cập nhật lại trạng thái mã giảm giá
        if ($coupon->usage_limit == 0) {
            // Bạn có thể thêm logic cập nhật trạng thái mã giảm giá ở đây, ví dụ:
            // $coupon->status = 'expired';
        }

        // Lưu lại mã giảm giá với usage_limit đã được giảm
        $coupon->save();

        return response()->json([
            'original_total' => $orderTotal,
            'discount' => $discount,
            'discounted_total' => $discountedTotal,
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/coupons",
     *     summary="Lấy danh sách coupon",
     *     description="API này trả về danh sách các coupon có loại là 1.",
     *     operationId="getCoupons",
     *     tags={"Coupons"},
     *     @OA\Response(
     *         response=200,
     *         description="Thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/CouponResource")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi xảy ra khi xử lý dữ liệu"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     )
     * )
     */
    public function index()
    {
        // GET
        try {
            $orders = Coupon::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => CouponResource::collection($orders)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/coupons/{id}",
     *     summary="Lấy chi tiết mã giảm giá",
     *     description="API này trả về thông tin chi tiết của một mã giảm giá dựa trên ID.",
     *     operationId="getCouponById",
     *     tags={"Coupons"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID của mã giảm giá cần lấy",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/CouponResource")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy mã giảm giá",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Không tìm thấy mã giảm giá"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi xảy ra khi xử lý dữ liệu"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $CouponDetails = Coupon::where('id', $id)->get();

            if ($CouponDetails->isEmpty()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Không tìm thấy mã giảm giá',
                    'data' => null
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => CouponResource::collection($CouponDetails)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/coupons/store",
     *     summary="Thêm mã giảm giá mới",
     *     description="API này thêm một mã giảm giá mới vào hệ thống.",
     *     operationId="createCoupon",
     *     tags={"Coupons"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Dữ liệu để tạo mã giảm giá",
     *         @OA\JsonContent(
     *             type="object",
     *             required={"code", "type", "value", "min_order_value", "expiry_date", "usage_limit"},
     *             @OA\Property(property="code", type="string", example="DISCOUNT2024"),
     *             @OA\Property(property="type", type="string", enum={"percentage", "fixed"}, example="percentage"),
     *             @OA\Property(property="value", type="integer", example=20),
     *             @OA\Property(property="min_order_value", type="integer", example=100000),
     *             @OA\Property(property="expiry_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="usage_limit", type="integer", example=50)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/CouponResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi yêu cầu",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Thông báo lỗi"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dữ liệu không hợp lệ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="code",
     *                     type="array",
     *                     @OA\Items(type="string", example="Trường mã giảm giá là bắt buộc.")
     *                 ),
     *                 @OA\Property(
     *                     property="type",
     *                     type="array",
     *                     @OA\Items(type="string", example="Trường loại chỉ được phép là percentage hoặc fixed.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        //POST 
        try {
            $validatedData = $request->validate([
                'code' => 'required|string',
                'type' => 'required|string|in:percentage,fixed',
                'value' => 'required|integer|min:1',
                'min_order_value' => 'required|integer|min:0',
                'expiry_date' => 'required|date|after_or_equal:today',
                'usage_limit' => 'required|integer|min:1'
            ], [
                'code.required' => 'Trường mã giảm giá là bắt buộc.',
                'code.string' => 'Trường mã giảm giá phải là chuỗi.',

                'type.required' => 'Trường loại là bắt buộc.',
                'type.string' => 'Trường loại phải là chuỗi.',
                'type.in' => 'Trường loại chỉ được phép là percentage hoặc fixed.',

                'value.required' => 'Trường giá trị là bắt buộc.',
                'value.integer' => 'Trường giá trị phải là số nguyên.',
                'value.min' => 'Trường giá trị phải lớn hơn hoặc bằng 1.',

                'min_order_value.required' => 'Trường giá trị đơn hàng tối thiểu là bắt buộc.',
                'min_order_value.integer' => 'Trường giá trị đơn hàng tối thiểu phải là số nguyên.',
                'min_order_value.min' => 'Trường giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',

                'expiry_date.required' => 'Trường ngày hết hạn là bắt buộc.',
                'expiry_date.date' => 'Trường ngày hết hạn phải là định dạng ngày hợp lệ.',
                'expiry_date.after_or_equal' => 'Trường ngày hết hạn phải từ hôm nay trở đi.',

                'usage_limit.required' => 'Trường giới hạn sử dụng là bắt buộc.',
                'usage_limit.integer' => 'Trường giới hạn sử dụng phải là số nguyên.',
                'usage_limit.min' => 'Trường giới hạn sử dụng phải lớn hơn hoặc bằng 1.'
            ]);

            $Coupon = Coupon::create($validatedData);
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành công',
                'data' => new CouponResource($Coupon)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/coupons/update/{id}",
     *     summary="Cập nhật mã giảm giá",
     *     description="API này cập nhật thông tin của một mã giảm giá cụ thể.",
     *     operationId="updateCoupon",
     *     tags={"Coupons"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID của mã giảm giá cần cập nhật",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Dữ liệu cập nhật mã giảm giá",
     *         @OA\JsonContent(
     *             type="object",
     *             required={"code", "type", "value", "min_order_value", "expiry_date", "usage_limit"},
     *             @OA\Property(property="code", type="string", example="NEWCODE2024"),
     *             @OA\Property(property="type", type="string", enum={"percentage", "fixed"}, example="fixed"),
     *             @OA\Property(property="value", type="integer", example=30),
     *             @OA\Property(property="min_order_value", type="integer", example=200000),
     *             @OA\Property(property="expiry_date", type="string", format="date", example="2025-01-01"),
     *             @OA\Property(property="usage_limit", type="integer", example=100)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Coupon updated successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/CouponResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy mã giảm giá",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Không tìm thấy mã giảm giá"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dữ liệu không hợp lệ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="code",
     *                     type="array",
     *                     @OA\Items(type="string", example="Trường mã giảm giá là bắt buộc.")
     *                 ),
     *                 @OA\Property(
     *                     property="type",
     *                     type="array",
     *                     @OA\Items(type="string", example="Trường loại chỉ được phép là percentage hoặc fixed.")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Server error message"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     )
     * )
     */

    public function update(Request $request, $id)
    {
        // PUT PATCH
        try {
            $validatedData = $request->validate([
                'code' => 'required|string',
                'type' => 'required|string|in:percentage,fixed',
                'value' => 'required|integer|min:1',
                'min_order_value' => 'required|integer|min:0',
                'expiry_date' => 'required|date|after_or_equal:today',
                'usage_limit' => 'required|integer|min:1'
            ], [
                'code.required' => 'Trường mã giảm giá là bắt buộc.',
                'code.string' => 'Trường mã giảm giá phải là chuỗi.',

                'type.required' => 'Trường loại là bắt buộc.',
                'type.string' => 'Trường loại phải là chuỗi.',
                'type.in' => 'Trường loại chỉ được phép là percentage hoặc fixed.',

                'value.required' => 'Trường giá trị là bắt buộc.',
                'value.integer' => 'Trường giá trị phải là số nguyên.',
                'value.min' => 'Trường giá trị phải lớn hơn hoặc bằng 1.',

                'min_order_value.required' => 'Trường giá trị đơn hàng tối thiểu là bắt buộc.',
                'min_order_value.integer' => 'Trường giá trị đơn hàng tối thiểu phải là số nguyên.',
                'min_order_value.min' => 'Trường giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',

                'expiry_date.required' => 'Trường ngày hết hạn là bắt buộc.',
                'expiry_date.date' => 'Trường ngày hết hạn phải là định dạng ngày hợp lệ.',
                'expiry_date.after_or_equal' => 'Trường ngày hết hạn phải từ hôm nay trở đi.',

                'usage_limit.required' => 'Trường giới hạn sử dụng là bắt buộc.',
                'usage_limit.integer' => 'Trường giới hạn sử dụng phải là số nguyên.',
                'usage_limit.min' => 'Trường giới hạn sử dụng phải lớn hơn hoặc bằng 1.'
            ]);

            // Kiểm tra nếu danh mục tồn tại trước khi cập nhật
            $coupon = Coupon::findOrFail($id);
            $coupon->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Coupon updated successfully',
                'data' => new CouponResource($coupon),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }


    /**
     * @OA\Delete(
     *     path="/api/coupons/destroy/{id}",
     *     summary="Xóa mã giảm giá",
     *     description="API này xóa một mã giảm giá cụ thể.",
     *     operationId="deleteCoupon",
     *     tags={"Coupons"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID của mã giảm giá cần xóa",
     *         required=true,
     *         @OA\Schema(type="string", example="1")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Xóa thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Xóa thành công"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Mã giảm giá không tồn tại",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="mã giảm giá không tồn tại"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi hệ thống"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     )
     * )
     */
    public function destroy(string $id)
    {
        try {
            $coupon = Coupon::findOrFail($id);

            // Xóa mã giảm giá
            $coupon->delete();

            // Trả về phản hồi thành công
            return response()->json([
                'status' => "success",
                'message' => 'Xóa thành công',
                'data' => null,
            ], 204);
        } catch (ModelNotFoundException $e) {
            // Nếu không tìm thấy mã giảm giá, trả về mã lỗi 404
            return response()->json([
                'status' => 'fail',
                'message' => 'mã giảm giá không tồn tại',
                'data' => null
            ], 404);
        } catch (\Exception $e) {
            // Xử lý các lỗi khác và trả về mã lỗi 500
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
