<?php

namespace App\Http\Controllers;

use App\Models\ChiTietDonHang;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\DonHang;  // Model của bảng DonHang
use App\Models\User;
use App\Models\SanPham; // Model
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderDetailResource;
use Illuminate\Support\Facades\DB;
use Swagger\Annotations as SWG;

class MomoApiController extends Controller
{
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }

    /**
     * @OA\Post(
     *     path="/api/Store/MOMO",
     *     tags={"MoMo"},
     *     summary="Tạo yêu cầu thanh toán qua MoMo",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"Mataikhoan", "PTTT", "chi_tiet"},
     *             @OA\Property(property="Mataikhoan", type="integer", example=1, description="Mã tài khoản của người dùng"),
     *             @OA\Property(property="PTTT", type="string", example="ATM", description="Phương thức thanh toán"),
     *             @OA\Property(property="GhiChu", type="string", nullable=true, example="Thanh toán nhanh", description="Ghi chú đơn hàng"),
     *             @OA\Property(property="Discount", type="number", nullable=true, example=10000, description="Số tiền giảm giá"),
     *             @OA\Property(
     *                 property="chi_tiet",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     required={"MaSP", "SoLuong"},
     *                     @OA\Property(property="MaSP", type="integer", example=1, description="Mã sản phẩm"),
     *                     @OA\Property(property="SoLuong", type="integer", example=2, description="Số lượng sản phẩm")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Yêu cầu thanh toán thành công",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Tạo yêu cầu thanh toán thành công"),
     *             @OA\Property(property="url", type="string", example="https://momo.vn/redirect-url", description="URL chuyển hướng thanh toán"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="Mataikhoan", type="integer", example=1, description="Mã tài khoản"),
     *                 @OA\Property(property="chi_tiet", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="TongTien", type="number", example=200000, description="Tổng số tiền"),
     *                 @OA\Property(property="SoLuong", type="integer", example=5, description="Tổng số lượng sản phẩm"),
     *                 @OA\Property(property="Discount", type="number", example=10000, description="Số tiền giảm giá"),
     *                 @OA\Property(property="PTTT", type="string", example="ATM", description="Phương thức thanh toán"),
     *                 @OA\Property(property="GhiChu", type="string", example="Thanh toán nhanh", description="Ghi chú đơn hàng"),
     *                 @OA\Property(property="jsonResult", type="object", description="Kết quả JSON từ MoMo API")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Yêu cầu thanh toán thất bại",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Không thể tạo yêu cầu thanh toán")
     *         )
     *     )
     * )
     */
    public function MOMO(Request $request)
    {
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnercode = 'MOMOBKUN20180529';
        $accesskey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';


        $orderInFo = "Thanh toán qua MoMo";
        // $amount = "10000";
        // $orderId = time() . "";
        $RedirectUrl = "http://127.0.0.1:8000/api/momo/callback";
        $IpnUrl = "http://127.0.0.1:8000/api/momo/callback";
        // Validate dữ liệu đầu vào
        $validatedData = $request->validate([
            'Mataikhoan' => 'required|integer|exists:users,Mataikhoan',
            'PTTT' => 'required|string|max:50',
            'GhiChu' => 'nullable|string|max:255',
            'Discount' => 'nullable|numeric|min:0',
            'chi_tiet' => 'required|array',
            'chi_tiet.*.MaSP' => 'required|integer|exists:san_pham,MaSP',
            'chi_tiet.*.SoLuong' => 'required|integer|min:1|max:50',
        ]);

        try {

            $discount = $validatedData['Discount'] ?? 0;

            // Tính tổng tiền và số lượng
            $tongTien = 0;
            $tongSoLuong = 0;
            foreach ($validatedData['chi_tiet'] as $item) {
                $sanPham = SanPham::findOrFail($item['MaSP']);
                $DonGia = $sanPham->GiaSP - $sanPham->GiamGia;
                $tongTien += $DonGia * $item['SoLuong'];
                $tongSoLuong += $item['SoLuong'];
            }

            $tongTien -= $discount; // Áp dụng giảm giá

            $validatedData['TrangThai'] = 'da_thanh_toan'; // Trạng thái đơn hàng
            $validatedData['Loai'] = 1;       // Loại 1 là sản phẩm
            $validatedData['NgayDat'] = now();    // Ngày đặt đơn
            $validatedData['NgayGiao'] = now()->addDays(4); // Ngày giao đơn (cộng 4 ngày)
            // Tạo đơn hàng



            $ExtraData = json_encode($validatedData);


            $partnerCode = $partnercode;
            $accessKey = $accesskey;
            $serectkey = $secretKey;
            $orderId = time() . ""; // Mã đơn hàng
            $orderInfo = $orderInFo;
            $amount = $tongTien;
            $ipnUrl = $IpnUrl;
            $redirectUrl = $RedirectUrl;
            $extraData = $ExtraData;

            $requestId = time() . "";
            $requestType = "payWithATM";
            // $extraData = ($_POST["extraData"] ? $_POST["extraData"] : "");
            //before sign HMAC SHA256 signature
            $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
            $signature = hash_hmac("sha256", $rawHash, $serectkey);
            $data = array(
                'partnerCode' => $partnerCode,
                'partnerName' => "Test",
                "storeId" => "MomoTestStore",
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            );
            $result = $this->execPostRequest($endpoint, json_encode($data));
            $jsonResult = json_decode($result, true);  // decode json

            //Just a example, please check more in there
            Log::info('MoMo Response', ['response' => $result]);


            return response()->json([
                'status' => 'success',
                'message' => 'Tạo yêu cầu thanh toán thành công',
                'url' => $jsonResult,
                'data' => [
                    'Mataikhoan' => $validatedData['Mataikhoan'],
                    'chi_tiet' => $validatedData['chi_tiet'],
                    'TongTien' => $tongTien,
                    'SoLuong' => $tongSoLuong,
                    'Discount' => $discount,
                    'PTTT' => $validatedData['PTTT'],
                    'GhiChu' => $validatedData['GhiChu'],
                    'jsonResult' => $jsonResult,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function handleMOMOCallback(Request $request)
    {
        $inputData = $request->all();

        try {
            // Lấy dữ liệu từ extraData
            $validatedData = json_decode($inputData['extraData'], true);

            // Kiểm tra kết quả giao dịch
            if ($inputData['resultCode'] == '0') {
                // Tìm thông tin người dùng
                $user = User::findOrFail($validatedData['Mataikhoan']);
                $discount = $validatedData['Discount'] ?? 0;

                // Tính toán tổng tiền và số lượng sản phẩm
                $tongTien = 0;
                $tongSoLuong = 0;

                foreach ($validatedData['chi_tiet'] as $item) {
                    $sanPham = SanPham::findOrFail($item['MaSP']);
                    $donGia = $sanPham->GiaSP - $sanPham->GiamGia;
                    $tongTien += $donGia * $item['SoLuong'];
                    $tongSoLuong += $item['SoLuong'];
                }

                $tongTien -= $discount;

                // Tạo đơn hàng
                $order = DonHang::create([
                    'Mataikhoan' => $validatedData['Mataikhoan'],
                    'TongTien' => $tongTien,
                    'SoLuong' => $tongSoLuong,
                    'Ten' => $user->Hovaten,
                    'SDT' => $user->SDT,
                    'DiaChi' => $user->DiaChi,
                    'PTTT' => $validatedData['PTTT'],
                    'GhiChu' => $validatedData['GhiChu'],
                    'Loai' => 1, // Loại đơn hàng
                    'TrangThai' => 'da_thanh_toan',
                    'NgayDat' => now(),
                    'NgayGiao' => now()->addDays(4),
                    'Discount' => $discount,
                ]);

                // Lưu chi tiết đơn hàng
                foreach ($validatedData['chi_tiet'] as $item) {
                    $sanPham = SanPham::findOrFail($item['MaSP']);
                    $donGia = $sanPham->GiaSP - $sanPham->GiamGia;

                    ChiTietDonHang::create([
                        'MaDH' => $order->MaDH,
                        'MaSP' => $item['MaSP'],
                        'DonGia' => $donGia,
                        'SoLuong' => $item['SoLuong'],
                    ]);
                }
            

                return redirect('http://localhost:3000/sanpham');
            } else {
                return redirect('http://localhost:3000');
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
