<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DonHang;
use App\Models\ChiTietDonHang;
use App\Models\User;
use App\Http\Resources\ServiceOrderResource;
use App\Http\Resources\OrderDetailResource;
use App\Models\SanPham;
use Carbon\Carbon;

/**
 * @OA\Schema(
 *     schema="ServiceOrderResource",
 *     type="object",
 *     @OA\Property(property="MaDonHang", type="integer", example=1),
 *     @OA\Property(property="Mataikhoan", type="integer", example=1),
 *     @OA\Property(property="TongTien", type="integer", example=500000),
 *     @OA\Property(property="SoLuong", type="integer", example=1),
 *     @OA\Property(property="Ten", type="string", example="Nguyễn Văn A"),
 *     @OA\Property(property="SDT", type="string", example="0123456789"),
 *     @OA\Property(property="DiaChi", type="string", example="123 Đường ABC, Quận 1, TP.HCM"),
 *     @OA\Property(property="PTTT", type="string", example="Chuyển khoản"),
 *     @OA\Property(property="GhiChu", type="string", example="Ghi chú đơn hàng 1"),
 *     @OA\Property(property="Loai", type="string", example="1"),
 *     @OA\Property(property="NgayDat", type="string", format="date-time", example="2024-10-29T17:09:04Z"),
 *     @OA\Property(property="NgayGiao", type="string", format="date-time", example="2024-11-01T17:09:04Z"),
 *     @OA\Property(property="TrangThai", type="string", example="Đang xử lý"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-29T17:09:04Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-10-29T17:09:04Z")
 * )
 */
class ServiceOrderApiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/orderServices",
     *     tags={"DonHangDichVu"},
     *     summary="Lấy danh sách đơn hàng",
     *     description="Trả về danh sách tất cả các đơn hàng.",
     *     @OA\Response(
     *         response=200,
     *         description="Dữ liệu được lấy thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/ServiceOrderResource")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Thông báo lỗi"),
     *             @OA\Property(property="data", type="string", nullable=true, example=null)
     *         )
     *     )
     * )
     */
    public function index()
    {
        // GET
        try {
            $orders = DonHang::all()->where('Loai', '0');
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => ServiceOrderResource::collection($orders)
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
     *     path="/api/orderServices/{Mataikhoan}",
     *     tags={"DonHangDichVu"},
     *     summary="Lấy đơn hàng theo tài khoản",
     *     description="Trả về đơn hàng",
     *     @OA\Parameter(
     *         name="Mataikhoan",
     *         in="path",
     *         required=true,
     *         description="ID của tài khoản cần lấy thông tin đơn hàng",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ServiceOrderResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Tài khoản không tìm thấy")
     * )
     */
    public function orders($Mataikhoan)
    {
        //GET
        try {
            $order = DonHang::where('Mataikhoan', $Mataikhoan)
                ->where('Loai', '0')
                ->get();

            if ($order->isEmpty()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Không tìm thấy chi tiết đơn hàng',
                    'data' => null
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => ServiceOrderResource::collection($order)
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
     *     path="/api/orderServices",
     *     tags={"DonHangDichVu"},
     *     summary="Tạo đơn hàng mới",
     *     description="Tạo một đơn hàng mới cùng với chi tiết đơn hàng.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Mataikhoan", "NgayGiao", "chi_tiet"},
     *             @OA\Property(property="Mataikhoan", type="integer", example=1, description="Mã tài khoản của người đặt hàng"),
     *             @OA\Property(property="GhiChu", type="string", example="Ghi chú đơn hàng", description="Ghi chú cho đơn hàng"),
     *             @OA\Property(property="NgayGiao", type="string", format="date-time", example="2024-11-30 15:30:00", description="Ngày giờ sử dụng đơn hàng"),
     *             @OA\Property(property="chi_tiet", type="array", @OA\Items(
     *                 @OA\Property(property="MaSP", type="integer", example=60, description="Mã dịch vụ"),
     *                 @OA\Property(property="SoLuong", type="integer", example=1, description="Số lượng dịch vụ"),
     *             )),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ServiceOrderResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi xác thực hoặc dữ liệu không hợp lệ",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Thông báo lỗi"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        //POST 
        try {
            // Validate dữ liệu đầu vào
            $validatedData = $request->validate([
                'Mataikhoan' => 'required|integer|exists:users,Mataikhoan', // Kiểm tra tồn tại
                'GhiChu' => 'nullable|string|max:255',
                'NgayGiao' => 'required|date',

                'chi_tiet' => 'required|array', // Đảm bảo rằng 'chi_tiet' là một mảng
                'chi_tiet.*.MaSP' => 'required|integer|exists:san_pham,MaSP', // Kiểm tra sản phẩm
                'chi_tiet.*.SoLuong' => 'required|integer|min:1|max:50',
            ], [
                'Mataikhoan.required' => 'Vui lòng nhập mã tài khoản',
                'Mataikhoan.integer' => 'Mã tài khoản phải là số',
                'Mataikhoan.exists' => 'Mã tài khoản không tồn tại',

                'GhiChu.string' => 'Ghi chú phải là chuỗi ký tự',
                'GhiChu.max' => 'Ghi chú không được vượt quá 255 ký tự',
                'NgayGiao.date' => 'Phải là ngày tháng.',

                'chi_tiet.required' => 'Vui lòng cung cấp chi tiết đơn hàng',
                'chi_tiet.array' => 'Chi tiết đơn hàng phải là một mảng',
                'chi_tiet.*.MaSP.required' => 'Vui lòng nhập mã sản phẩm',
                'chi_tiet.*.SoLuong.required' => 'Vui lòng nhập số lượng',
            ]);



            // Lấy thông tin người dùng từ bảng users
            $user = User::findOrFail($validatedData['Mataikhoan']);
            // Khởi tạo trạng thái và ngày đặt
            $validatedData['TrangThai'] = 'cho_xac_nhan';
            $validatedData['PTTT'] = 'Tiền mặt';
            $validatedData['Loai'] = 0;       // loại 1 là dịch vụ
            $validatedData['NgayDat'] = now();    // Thời gian hiện tại
            // Chuyển đổi 'NgayGiao' từ ISO 8601 sang định dạng MySQL
            if (!empty($validatedData['NgayGiao'])) {
                $validatedData['NgayGiao'] = Carbon::parse($validatedData['NgayGiao'])->format('Y-m-d H:i:s');
            }
            // Tạo đơn hàng
            $order = DonHang::create([
                'Mataikhoan' => $validatedData['Mataikhoan'],
                'TongTien' => 0, // Tổng tiền sẽ được tính sau
                'SoLuong' => 0,   // Khởi tạo SoLuong
                'Ten' => $user->Hovaten,       // Lấy tên từ bảng users
                'SDT' => $user->SDT,       // Lấy SDT từ bảng users
                'DiaChi' => $user->DiaChi, // Lấy địa chỉ từ bảng users
                'PTTT' => $validatedData['PTTT'],
                'GhiChu' => $validatedData['GhiChu'],
                'Loai' => $validatedData['Loai'],
                'TrangThai' => $validatedData['TrangThai'],
                'NgayDat' => $validatedData['NgayDat'],
                'NgayGiao' => $validatedData['NgayGiao'],
            ]);

            // Lưu chi tiết đơn hàng và tính tổng tiền & số lượng
            $tongTien = 0; // Khởi tạo tổng tiền
            $tongSoLuong = 0; // Khởi tạo tổng số lượng
            foreach ($validatedData['chi_tiet'] as $item) {
                // Lấy giá của sản phẩm từ bảng san_pham
                $sanPham = SanPham::findOrFail($item['MaSP']);

                // Kiểm tra nếu Loai của sản phẩm không phải là 0
                if ($sanPham->Loai != 0) {
                    return response()->json([
                        'status' => 'fail',
                        'message' => 'Sản phẩm phải là dịch vụ',
                        'data' => null
                    ], 400);
                }

                $DonGia = $sanPham->GiaSP - $sanPham->GiamGia;

                // Tạo chi tiết đơn hàng
                $ctDonHang = ChiTietDonHang::create([
                    'MaDH' => $order->MaDH,
                    'MaSP' => $item['MaSP'],
                    'DonGia' => $DonGia,  // Sử dụng giá từ bảng san_pham
                    'SoLuong' => $item['SoLuong'],
                ]);

                // Cập nhật tổng tiền
                $tongTien += $ctDonHang->DonGia * $ctDonHang->SoLuong;
                $tongSoLuong += $ctDonHang->SoLuong; // Cộng dồn số lượng
            }

            // Cập nhật tổng tiền và số lượng cho đơn hàng
            $order->update([
                'TongTien' => $tongTien,
                'SoLuong' => $tongSoLuong // Cập nhật số lượng
            ]);

            // Trả về thông tin đơn hàng vừa tạo
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm đơn hàng thành công',
                'data' => new ServiceOrderResource($order->load('orderDetails')) // Trả về đơn hàng vừa tạo
            ], 201);
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
     *     path="/api/orderDetailServices/{MaDH}",
     *     tags={"DonHangDichVu"},
     *     summary="Lấy chi tiết đơn hàng",
     *     description="Lấy chi tiết đơn hàng bao gồm thông tin sản phẩm theo mã đơn hàng.",
     *     @OA\Parameter(
     *         name="MaDH",
     *         in="path",
     *         required=true,
     *         description="Mã đơn hàng",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="MaCTDH", type="integer", example=1),
     *                     @OA\Property(property="MaDH", type="string", example="DH001"),
     *                     @OA\Property(property="MaSP", type="string", example="SP001"),
     *                     @OA\Property(property="DonGia", type="number", format="float", example=50000),
     *                     @OA\Property(property="SoLuong", type="integer", example=2),
     *                     @OA\Property(property="NgayDat", type="string", format="date-time", example="2024-10-29T17:09:04Z"),
     *                     @OA\Property(
     *                         property="SanPham",
     *                         type="object",
     *                         @OA\Property(property="TenSP", type="string", example="Sản phẩm A"),
     *                         @OA\Property(property="MoTa", type="string", example="Mô tả sản phẩm A"),
     *                         @OA\Property(property="Gia", type="number", format="float", example=50000),
     *                         @OA\Property(property="HinhAnh", type="string", example="https://example.com/image.jpg")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy chi tiết đơn hàng",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Không tìm thấy chi tiết đơn hàng"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi server"),
     *             @OA\Property(property="data", type="null", example=null)
     *         )
     *     )
     * )
     */
    public function show($MaDH)
    {
        //GET
        try {
            // Eager load bảng 'san_pham' liên quan
            $orderDetails = ChiTietDonHang::where('MaDH', $MaDH)
                ->with('sanPham') // Đảm bảo có một mối quan hệ 'sanPham' được định nghĩa trong model ChiTietDonHang
                ->get();

            if ($orderDetails->isEmpty()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Không tìm thấy chi tiết đơn hàng',
                    'data' => null
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => OrderDetailResource::collection($orderDetails)
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
