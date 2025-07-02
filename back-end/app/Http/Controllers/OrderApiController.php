<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use App\Models\DonHang;
use App\Models\ChiTietDonHang;
use App\Models\User;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderDetailResource;
use App\Models\SanPham;
use Illuminate\Support\Facades\Session;
use App\Models\vnpay; // Thay YourModel bằng tên thực của model




/**
 * @OA\Schema(
 *     schema="OrderResource",
 *     type="object",
 *     @OA\Property(property="MaDonHang", type="integer", example=1),
 *     @OA\Property(property="Mataikhoan", type="integer", example=1),
 *     @OA\Property(property="TongTien", type="integer", example=500000),
 *     @OA\Property(property="Discount", type="integer", example=500000),
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




class OrderApiController extends Controller
{


    /**
     * @OA\Get(
     *     path="/api/orders",
     *     tags={"DonHang"},
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
     *                 @OA\Items(ref="#/components/schemas/OrderResource")
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
            $orders = DonHang::all()->where('Loai', '1');
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => OrderResource::collection($orders)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    public function indexs()
    {
        // GET
        try {
            $orders = DonHang::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => OrderResource::collection($orders)
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
     *     path="/api/orders/{Mataikhoan}",
     *     tags={"DonHang"},
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
     *             @OA\Property(property="data", ref="#/components/schemas/OrderResource")
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
                ->where('Loai', '1')
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
                'data' => OrderResource::collection($order)
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
     *     path="/api/orders",
     *     tags={"DonHang"},
     *     summary="Tạo đơn hàng mới",
     *     description="Tạo một đơn hàng mới cùng với chi tiết đơn hàng.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Mataikhoan", "PTTT", "chi_tiet"},
     *             @OA\Property(property="Mataikhoan", type="integer", example=1, description="Mã tài khoản của người đặt hàng"),
     *             @OA\Property(property="PTTT", type="string", example="Chuyển khoản", description="Phương thức thanh toán"),
     *             @OA\Property(property="GhiChu", type="string", example="Ghi chú đơn hàng", description="Ghi chú cho đơn hàng"),
     *             @OA\Property(property="chi_tiet", type="array", @OA\Items(
     *                 @OA\Property(property="MaSP", type="integer", example=1, description="Mã sản phẩm"),
     *                 @OA\Property(property="SoLuong", type="integer", example=2, description="Số lượng sản phẩm"),
     *             )),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/OrderResource")
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
        try {
            // Validate dữ liệu đầu vào
            $validatedData = $request->validate([
                'Mataikhoan' => 'required|integer|exists:users,Mataikhoan', // Kiểm tra tồn tại
                'PTTT' => 'required|string|max:50',
                'GhiChu' => 'nullable|string|max:255',
                'Discount' => 'nullable|numeric|min:0', // Kiểm tra giảm giá (nếu có)

                'chi_tiet' => 'required|array', // Đảm bảo rằng 'chi_tiet' là một mảng
                'chi_tiet.*.MaSP' => 'required|integer|exists:san_pham,MaSP', // Kiểm tra sản phẩm
                'chi_tiet.*.SoLuong' => 'required|integer|min:1|max:50',
            ], [
                'Mataikhoan.required' => 'Vui lòng nhập mã tài khoản',
                'Mataikhoan.integer' => 'Mã tài khoản phải là số',
                'Mataikhoan.exists' => 'Mã tài khoản không tồn tại',

                'PTTT.required' => 'Vui lòng nhập phương thức thanh toán',
                'PTTT.string' => 'Phương thức thanh toán phải là chuỗi ký tự',
                'PTTT.max' => 'Phương thức thanh toán không được vượt quá 50 ký tự',

                'GhiChu.string' => 'Ghi chú phải là chuỗi ký tự',
                'GhiChu.max' => 'Ghi chú không được vượt quá 255 ký tự',

                'chi_tiet.required' => 'Vui lòng cung cấp chi tiết đơn hàng',
                'chi_tiet.array' => 'Chi tiết đơn hàng phải là một mảng',
                'chi_tiet.*.MaSP.required' => 'Vui lòng nhập mã sản phẩm',
                'chi_tiet.*.SoLuong.required' => 'Vui lòng nhập số lượng',
            ]);

            // Lấy thông tin người dùng từ bảng users
            $user = User::findOrFail($validatedData['Mataikhoan']);

            // Khởi tạo thông tin đơn hàng
            $validatedData['TrangThai'] = 'cho_xac_nhan'; // Trạng thái đơn hàng
            $validatedData['Loai'] = 1;       // Loại 1 là sản phẩm
            $validatedData['NgayDat'] = now();    // Ngày đặt đơn
            $validatedData['NgayGiao'] = now()->addDays(4); // Ngày giao đơn (cộng 4 ngày)

            // Xử lý giảm giá, nếu có
            $discount = $validatedData['Discount'] ?? 0; // Nếu không có discount thì gán mặc định là 0

            // Tạo đơn hàng
            $order = DonHang::create([
                'Mataikhoan' => $validatedData['Mataikhoan'],
                'TongTien' => 0, // Tổng tiền sẽ tính sau
                'SoLuong' => 0,   // Số lượng sẽ tính sau
                'Ten' => $user->Hovaten,       // Lấy tên từ bảng users
                'SDT' => $user->SDT,           // Lấy SDT từ bảng users
                'DiaChi' => $user->DiaChi,     // Lấy địa chỉ từ bảng users
                'PTTT' => $validatedData['PTTT'],
                'GhiChu' => $validatedData['GhiChu'],
                'Loai' => $validatedData['Loai'],
                'TrangThai' => $validatedData['TrangThai'],
                'NgayDat' => $validatedData['NgayDat'],
                'NgayGiao' => $validatedData['NgayGiao'],
                'Discount' => $discount, // Lưu discount vào cơ sở dữ liệu
            ]);

            // Khởi tạo tổng tiền và tổng số lượng
            $tongTien = 0; // Tổng tiền
            $tongSoLuong = 0; // Tổng số lượng

            // Lưu chi tiết đơn hàng và tính tổng tiền & số lượng
            foreach ($validatedData['chi_tiet'] as $item) {
                // Lấy thông tin sản phẩm từ bảng san_pham
                $sanPham = SanPham::findOrFail($item['MaSP']);
                $DonGia = $sanPham->GiaSP - $sanPham->GiamGia; // Tính giá sản phẩm (giá gốc trừ giảm giá)

                // Tạo chi tiết đơn hàng
                $ctDonHang = ChiTietDonHang::create([
                    'MaDH' => $order->MaDH,
                    'MaSP' => $item['MaSP'],
                    'DonGia' => $DonGia,  // Sử dụng giá sản phẩm đã tính
                    'SoLuong' => $item['SoLuong'],
                ]);

                // Cập nhật tổng tiền và số lượng
                $tongTien += $ctDonHang->DonGia * $ctDonHang->SoLuong;
                $tongSoLuong += $ctDonHang->SoLuong; // Cộng dồn số lượng
            }

            // Trừ giảm giá vào tổng tiền
            $tongTien -= $discount; // Trừ vào tổng tiền nếu có giảm giá

            // Cập nhật lại tổng tiền và số lượng cho đơn hàng
            $order->update([
                'TongTien' => $tongTien,
                'SoLuong' => $tongSoLuong, // Cập nhật tổng số lượng
            ]);

            // Trả về thông tin đơn hàng vừa tạo
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm đơn hàng thành công',
                'data' => new OrderResource($order->load('orderDetails')) // Trả về đơn hàng và chi tiết
            ], 201);
        } catch (\Exception $e) {
            // Nếu có lỗi, trả về thông báo lỗi chi tiết
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }





    /**
     * @OA\Get(
     *     path="/api/orderDetails/{MaDH}",
     *     tags={"DonHang"},
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
                ->whereHas('donHang', function ($query) {
                    $query->where('Loai', '1');
                })
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


    /**
     * @OA\Put(
     *     path="/api/orders/{MaDH}",
     *     tags={"DonHang"},
     *     summary="Cập nhật thông tin đơn hàng",
     *     description="Cập nhật thông tin của đơn hàng với mã đơn hàng cụ thể",
     *     @OA\Parameter(
     *         name="MaDH",
     *         in="path",
     *         required=true,
     *         description="Mã đơn hàng cần cập nhật",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Ten", "SDT", "DiaChi", "PTTT", "GhiChu", "TrangThai", "NgayGiao"},
     *             @OA\Property(property="Ten", type="string", example="Nguyễn Văn A"),
     *             @OA\Property(property="SDT", type="string", example="0123456789"),
     *             @OA\Property(property="DiaChi", type="string", example="123 Đường ABC, Quận 1, TP.HCM"),
     *             @OA\Property(property="PTTT", type="string", example="Chuyển khoản"),
     *             @OA\Property(property="GhiChu", type="string", example="Ghi chú đơn hàng"),
     *             @OA\Property(property="TrangThai", type="string", example="dang_xu_ly", enum={"cho_xac_nhan", "dang_xu_ly", "hoan_thanh", "huy"}),
     *             @OA\Property(property="NgayGiao", type="string", format="date", example="2024-11-10")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Cập nhật thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/OrderResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Yêu cầu không hợp lệ",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Thông báo lỗi"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */

    public function update(Request $request, $MaDH)
    {
        // PUT
        try {
            $validatedData = $request->validate([
                'Ten' => 'required|string|max:50',
                'SDT' => 'required|regex:/^[0-9]{10}$/',
                'DiaChi' => 'required',
                'PTTT' => 'required',

                'TrangThai' => 'required|in:cho_xac_nhan,da_xac_nhan,dang_van_chuyen,da_thanh_toan,hoan_thanh,huy',
                'NgayGiao' => 'required|date',
                'GhiChu' => 'nullable|string|max:255'
            ], [
                'Ten.required' => 'Vui lòng nhập Tên',
                'Ten.string' => 'tên phải là chữ',
                'Ten.max' => 'Độ dài thấp hơn 50 ký tự',
                'SDT.required' => 'Vui lòng nhập số điện thoại',
                'SDT.regex' => 'Số điện thoại phải gồm 10 chữ số',
                'DiaChi.required' => 'Vui lòng nhập địa chỉ',
                'PTTT.required' => 'Vui lòng nhập phương thức thanh toán',

                'TrangThai.required' => 'Vui lòng nhập trạng thái',
                'TrangThai.in' => 'Trạng thái phải là: cho_xac_nhan,da_xac_nhan,dang_van_chuyen,da_thanh_toan,hoan_thanh,huy',
                'NgayGiao.required' => 'Vui lòng nhập ngày giao',
                'NgayGiao.date' => 'Định dạng sai ngày tháng',
            ]);

            $order = DonHang::findOrFail($MaDH);
            $order->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thành công',
                'data' => new OrderResource($order)
            ], 200);
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
     *     path="/api/donhang/trangthai/{MaDH}",
     *     summary="Cập nhật trạng thái đơn hàng",
     *     description="Cập nhật trạng thái của một đơn hàng cụ thể",
     *     tags={"DonHang"},
     *     @OA\Parameter(
     *         name="MaDH",
     *         in="path",
     *         description="Mã đơn hàng cần cập nhật",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"TrangThai"},
     *             @OA\Property(
     *                 property="TrangThai",
     *                 type="string",
     *                 enum={"cho_xac_nhan", "dang_xu_ly", "hoan_thanh", "huy"},
     *                 description="Trạng thái mới của đơn hàng"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Cập nhật thành công"),
     *             @OA\Property(property="data", type="object", ref="#/components/schemas/OrderResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Cập nhật thất bại",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi thông báo"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy đơn hàng",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Không tìm thấy đơn hàng"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
    public function TrangThai(Request $request, $MaDH)
    {
        // PUT
        try {
            $validatedData = $request->validate([
                'TrangThai' => 'required|in:cho_xac_nhan,dang_xu_ly,hoan_thanh,huy',
            ], [
                'TrangThai.required' => 'Vui lòng nhập trạng thái',
                'TrangThai.in' => 'Trạng thái phải là: cho_xac_nhan, dang_xu_ly, hoan_thanh, huy',
            ]);

            $order = DonHang::findOrFail($MaDH);
            $order->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thành công',
                'data' => new OrderResource($order)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/orders/{id}",
     *     summary="Xóa đơn hàng và chi tiết liên quan",
     *     description="Xóa đơn hàng theo ID và xóa tất cả chi tiết đơn hàng liên quan.",
     *     operationId="destroyOrder",
     *     tags={"DonHang"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Mã đơn hàng cần xóa",
     *         required=true,
     *         @OA\Schema(
     *             type="string",
     *             example="1"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Đơn hàng và chi tiết đơn hàng đã được xóa thành công.",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Đơn hàng và chi tiết đơn hàng đã được xóa thành công.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi khi xóa đơn hàng.",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi: Không tìm thấy đơn hàng.")
     *         )
     *     )
     * )
     */

    public function destroy(string $id)
    {
        try {
            // Tìm đơn hàng theo ID
            $order = DonHang::findOrFail($id);

            // Xóa tất cả chi tiết đơn hàng liên quan
            $order->orderDetails()->delete();

            // Xóa đơn hàng
            $order->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Đơn hàng và chi tiết đơn hàng đã được xóa thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }



    /**
     * @OA\Post(
     *     path="/api/order/VnPay",
     *     tags={"DonHang"},
     *     summary="Thanh toán đơn hàng qua VNPAY",
     *     description="Tạo một đơn hàng mới và thực hiện thanh toán qua VNPAY.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Mataikhoan", "PTTT", "chi_tiet"},
     *             @OA\Property(
     *                 property="Mataikhoan",
     *                 type="integer",
     *                 example=1,
     *                 description="Mã tài khoản của người đặt hàng"
     *             ),
     *             @OA\Property(
     *                 property="PTTT",
     *                 type="string",
     *                 example="Thanh toán vnpay",
     *                 description="Phương thức thanh toán"
     *             ),
     *             @OA\Property(
     *                 property="GhiChu",
     *                 type="string",
     *                 example="Đơn hàng đã thanh toán",
     *                 description="Ghi chú cho đơn hàng"
     *             ),
     *             @OA\Property(
     *                 property="chi_tiet",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(
     *                         property="MaSP",
     *                         type="integer",
     *                         example=1,
     *                         description="Mã sản phẩm"
     *                     ),
     *                     @OA\Property(
     *                         property="SoLuong",
     *                         type="integer",
     *                         example=2,
     *                         description="Số lượng sản phẩm"
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Tạo đơn hàng và chuyển hướng thanh toán thành công",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Đơn hàng đã được tạo thành công và chuyển đến VNPAY."
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/OrderResource"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi xác thực hoặc dữ liệu không hợp lệ",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="fail"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Dữ liệu yêu cầu không hợp lệ"
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 type="null"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi trong quá trình xử lý",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="fail"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Lỗi hệ thống"
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 type="null"
     *             )
     *         )
     *     )
     * )
     */

    public function vnpay_payment(Request $request)
    {
        // Cấu hình ngày giờ
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        // Thông tin cấu hình VNPAY
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://127.0.0.1:8000/Store/VnPay";  // Địa chỉ trả về sau khi thanh toán
        $vnp_TmnCode = "WRPOFVZJ";  // Mã website tại VNPAY
        $vnp_HashSecret = "UI3TQRXZD5YVALKJDIQFBF2VMS9V57VC";  // Chuỗi bí mật của bạn từ VNPAY

        try {
            // Xác thực dữ liệu đầu vào
            $validatedData = $request->validate([
                'Mataikhoan' => 'required|integer|exists:users,Mataikhoan', // Kiểm tra tài khoản người dùng
                'PTTT' => 'required|string|max:50', // Phương thức thanh toán
                'GhiChu' => 'nullable|string|max:255', // Ghi chú
                'Discount' => 'nullable|numeric|min:0', // Giảm giá
                'chi_tiet' => 'required|array', // Chi tiết đơn hàng
                'chi_tiet.*.MaSP' => 'required|integer|exists:san_pham,MaSP', // Kiểm tra sản phẩm
                'chi_tiet.*.SoLuong' => 'required|integer|min:1|max:50', // Kiểm tra số lượng
            ]);

            // Lấy thông tin người dùng
            $user = User::findOrFail($validatedData['Mataikhoan']);

            // Tạo đơn hàng trong cơ sở dữ liệu
            $order = DonHang::create([
                'Mataikhoan' => $validatedData['Mataikhoan'],
                'TongTien' => 0, // Tổng tiền sẽ tính sau
                'SoLuong' => 0,   // Số lượng sẽ tính sau
                'Ten' => $user->Hovaten,
                'SDT' => $user->SDT,
                'DiaChi' => $user->DiaChi,
                'PTTT' => $validatedData['PTTT'],
                'GhiChu' => $validatedData['GhiChu'],
                'TrangThai' => 'dang_xu_ly', // Trạng thái đơn hàng
                'Loai' => 1, // Loại đơn hàng (sản phẩm)
                'NgayDat' => now(),
                'NgayGiao' => now()->addDays(4), // Ngày giao đơn hàng
                'Discount' => $validatedData['Discount'] ?? 0, // Giảm giá
            ]);

            // Tính tổng tiền và số lượng từ chi tiết đơn hàng
            $tongTien = 0;
            $tongSoLuong = 0;

            foreach ($validatedData['chi_tiet'] as $item) {
                $sanPham = SanPham::findOrFail($item['MaSP']);
                $DonGia = $sanPham->GiaSP - $sanPham->GiamGia; // Tính giá sản phẩm (giá gốc - giảm giá)

                // Thêm chi tiết đơn hàng vào cơ sở dữ liệu
                ChiTietDonHang::create([
                    'MaDH' => $order->MaDH,
                    'MaSP' => $item['MaSP'],
                    'DonGia' => $DonGia,
                    'SoLuong' => $item['SoLuong'],
                ]);

                // Cập nhật tổng tiền và số lượng
                $tongTien += $DonGia * $item['SoLuong'];
                $tongSoLuong += $item['SoLuong'];
            }

            // Trừ giảm giá vào tổng tiền
            $tongTien -= $order->Discount;

            // Cập nhật lại tổng tiền và số lượng cho đơn hàng
            $order->update([
                'TongTien' => $tongTien,
                'SoLuong' => $tongSoLuong,
            ]);

            // Tạo dữ liệu thanh toán VNPAY
            $vnp_TxnRef = uniqid(); // Mã đơn hàng ngẫu nhiên
            $vnp_OrderInfo = 'Thanh toán VNPAY';
            $vnp_OrderType = 'billpayment';
            $vnp_Amount = $request->input('amount') * 100; // Số tiền thanh toán (vnpay yêu cầu tính bằng đồng)

            $vnp_Locale = 'vn';
            $vnp_BankCode = 'NCB';
            $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

            // Thông tin thanh toán
            $vnp_Bill_Mobile = $user->SDT;
            $vnp_Bill_Email =  $user->Email;
            $fullName = $user->Hovaten;
            $vnp_Bill_Address = $user->DiaChi;
            $vnp_Bill_City = $user->DiaChi;
            $vnp_Bill_Country = 'VN';
            $vnp_Bill_State = 2;

            // Invoice
            $vnp_Inv_Phone = $vnp_Bill_Mobile;
            $vnp_Inv_Email = $vnp_Bill_Email;
            $vnp_Inv_Customer = $fullName;
            $vnp_Inv_Address = $vnp_Bill_Address;

            // Tạo URL thanh toán VNPAY
            $inputData = [
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef,
                "vnp_Bill_Mobile" => $vnp_Bill_Mobile,
                "vnp_Bill_Email" => $vnp_Bill_Email,
                "vnp_Bill_Address" => $vnp_Bill_Address,
                "vnp_Bill_City" => $vnp_Bill_City,
                "vnp_Bill_Country" => $vnp_Bill_Country,
                "vnp_Inv_Phone" => $vnp_Inv_Phone,
                "vnp_Inv_Email" => $vnp_Inv_Email,
                "vnp_Inv_Customer" => $vnp_Inv_Customer,
                "vnp_Inv_Address" => $vnp_Inv_Address,
            ];

            ksort($inputData);
            $query = '';
            $i = 0;
            $hashdata = '';

            // Tạo chuỗi hash dữ liệu
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            // Sinh mã bảo mật
            if (isset($vnp_HashSecret)) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
                $vnp_Url .= '?vnp_SecureHash=' . $vnpSecureHash;
            }

            // Trả về URL thanh toán
            return response()->json([
                'status' => 'success',
                'message' => 'Tạo đơn hàng và chuyển đến VNPAY thành công.',
                'data' => [
                    'vnp_Url' => $vnp_Url,
                    'order' => new OrderResource($order->load('orderDetails'))  // Trả về thông tin đơn hàng
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
