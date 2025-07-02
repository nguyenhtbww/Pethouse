<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SanPham;
use App\Models\DanhMuc;
use App\Http\Resources\ServiceResource;

/**
 * @OA\Schema(
 *     schema="ServiceResource",
 *     type="object",
 *     title="Service Resource",
 *     properties={
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="name", type="string", example="Service Name"),
 *         @OA\Property(property="price", type="number", format="float", example=99.99),
 *         @OA\Property(property="description", type="string", example="This is a service description.")
 *     }
 * )
 */
class ServiceApiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/services",
     *     tags={"DichVu"},
     *     summary="Lấy danh sách dịch vụ",
     *     description="Trả về danh sách tất cả các dịch vụ.",
     *     @OA\Response(
     *         response=200,
     *         description="Dữ liệu được lấy thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/ServiceResource"))
     *         )
     *     ),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */
    public function index()
    {
        // GET
        try {
            // Truy vấn dịch v và quan hệ danh mục
            $products = SanPham::with('danhMuc')
                ->whereHas('danhMuc', function ($query) {
                    $query->where('loai', '0');
                })
                ->where('Loai', '0')
                ->get();



            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => ServiceResource::collection($products)
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
     *     path="/api/services/store",
     *     tags={"DichVu"},
     *     summary="Thêm dịch vụ mới",
     *     description="Thêm dịch vụ vào danh sách.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"MaDanhMuc", "TenSanPham", "GiaSP", "HinhAnh", "MoTa"},
     *             @OA\Property(property="MaDanhMuc", type="integer", description="Mã danh mục dịch vụ"),
     *             @OA\Property(property="TenSanPham", type="string", description="Tên dịch vụ"),
     *             @OA\Property(property="GiaSP", type="number", description="Giá dịch vụ"),
     *             @OA\Property(property="GiamGia", type="number", description="Giảm giá dịch vụ"),
     *             @OA\Property(property="MoTa", type="string", description="Mô tả chi tiết dịch vụ"),
     *             @OA\Property(property="HinhAnh", type="string", format="url",  description="URL của hình ảnh dịch vụ"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm dịch vụ thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ServiceResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi khi thêm dịch vụ",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi mô tả chi tiết"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        //POST 
        try {
            $validatedData = $request->validate([
                'MaDanhMuc' => 'required|exists:danh_muc,MaDanhMuc', // Kiểm tra mã danh mục tồn tại
                'TenSanPham' => 'required',
                'GiaSP' => 'required|numeric',
                'GiamGia' => 'nullable|numeric',
                'HinhAnh' => 'required',
                'MoTa' => 'required',
            ], [
                'MaDanhMuc.required' => 'Vui lòng nhập mã danh mục',
                'MaDanhMuc.exists' => 'Danh mục không tồn tại',
                'TenSanPham.required' => 'Vui lòng nhập tên dịch vụ',
                'GiaSP.required' => 'Vui lòng nhập tên dịch vụ',
                'HinhAnh.required' => 'Vui lòng nhập ảnh',
                'MoTa.required' => 'Vui lòng nhập ảnh'
            ]);
            // Gán giá trị mặc định
            $validatedData['SoLuong'] = 0;        // Số lượng mặc định là 0
            $validatedData['LuotXem'] = 0;         // Lượt xem mặc định là 0
            $validatedData['LuotBan'] = 0;         // Lượt bán mặc định là 0
            $validatedData['TrangThai'] = 1;       // Trạng thái mặc định là 1
            $validatedData['Loai'] = 0;       // loại 0 là dịch vụ
            $validatedData['ThoiGian'] = now();    // Thời gian hiện tại
            if ($request->file('HinhAnh')) {
                $imageName = time() . '.' . $request->file('HinhAnh')->getClientOriginalExtension();
                $path = public_path('image/product'); // Đường dẫn đến thư mục lưu
                $request->file('HinhAnh')->move($path, $imageName); // Di chuyển hình ảnh vào thư mục
            }
            $product = SanPham::create([
                'MaDanhMuc' => $validatedData['MaDanhMuc'],
                'TenSanPham' => $validatedData['TenSanPham'],
                'GiaSP' => $validatedData['GiaSP'],
                'GiamGia' => $validatedData['GiamGia'],
                'MoTa' => $validatedData['MoTa'],
                'SoLuong' => $validatedData['SoLuong'],
                'HinhAnh' => $imageName,
                'LuotXem' => $validatedData['LuotXem'],
                'LuotBan' => $validatedData['LuotBan'],
                'ThoiGian' => $validatedData['ThoiGian'],
                'TrangThai' => $validatedData['TrangThai'],
                'Loai' => $validatedData['Loai'],
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành công',
                'data' => new ServiceResource($product)
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
     * @OA\Get(
     *     path="/api/services/{MaSP}",
     *     tags={"DichVu"},
     *     summary="Lấy thông tin chi tiết dịch vụ",
     *     description="Trả về thông tin chi tiết của dịch vụ dựa trên mã dịch vụ.",
     *     @OA\Parameter(
     *         name="MaSP",
     *         in="path",
     *         required=true,
     *         description="Mã dịch vụ cần lấy thông tin",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ServiceResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="dịch vụ không tìm thấy")
     * )
     */
    public function show($MaSP)
    {
        //GET
        try {
            $product = SanPham::where('Loai', 0)->findOrFail($MaSP);
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => new ServiceResource($product)
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
     *     path="/api/services/update/{MaSP}",
     *     tags={"DichVu"},
     *     summary="Cập nhật thông tin dịch vụ",
     *     description="Cập nhật thông tin dịch vụ dựa trên mã dịch vụ.",
     *     @OA\Parameter(
     *         name="MaSP",
     *         in="path",
     *         required=true,
     *         description="Mã dịch vụ cần cập nhật",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="MaDanhMuc", type="integer", example=1),
     *             @OA\Property(property="TenSanPham", type="string", example="dịch vụ A"),
     *             @OA\Property(property="GiaSP", type="number", format="float", example=100000),
     *             @OA\Property(property="GiamGia", type="number", format="float", example=0),
     *             @OA\Property(property="MoTa", type="string", example="Mô tả dịch vụ A"),
     *             @OA\Property(property="SoLuong", type="integer", example=10),
     *             @OA\Property(property="HinhAnh", type="string", example="hinh_anh_a.jpg"),
     *             @OA\Property(property="LuotXem", type="integer", example=0),
     *             @OA\Property(property="LuotBan", type="integer", example=0),
     *             @OA\Property(property="ThoiGian", type="string", format="date-time", example="2024-10-24 12:00:00"),
     *             @OA\Property(property="TrangThai", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Cập nhật thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ServiceResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi cập nhật dữ liệu"),
     *     @OA\Response(response=404, description="dịch vụ không tìm thấy")
     * )
     */
    public function update(Request $request, $MaSP)
    {
        // PUT
        try {
            $validatedData = $request->validate([
                'MaDanhMuc' => 'required|exists:danh_muc,MaDanhMuc',
                'TenSanPham' => 'required',
                'GiaSP' => 'required|numeric',
                'GiamGia' => 'nullable|numeric',
                'HinhAnh' => 'required',
                'MoTa' => 'required',
                'TrangThai' => 'nullable|integer'
            ], [
                'MaDanhMuc.required' => 'Vui lòng nhập mã danh mục',
                'MaDanhMuc.exists' => 'Danh mục không tồn tại',
                'TenSanPham.required' => 'Vui lòng nhập tên dịch vụ',
                'GiaSP.required' => 'Vui lòng nhập giá dịch vụ',
                'HinhAnh.required' => 'Vui lòng nhập ảnh',
                'MoTa.required' => 'Vui lòng nhập mô tả'
            ]);

            $product = SanPham::findOrFail($MaSP);
            $imageName = $product->HinhAnh;

            if ($request->hasFile('HinhAnh')) {
                $path = public_path('image/product');
                
                // Xóa hình ảnh cũ
                if ($product->HinhAnh) {
                    $oldFilePath = $path . '/' . $product->HinhAnh;
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); // Xóa hình cũ
                    }
                }
            
                // Lưu hình ảnh mới
                $imageName = time() . '.' . $request->file('HinhAnh')->getClientOriginalExtension();
                $request->file('HinhAnh')->move($path, $imageName);
            }
            $product->update([
                'MaDanhMuc' => $validatedData['MaDanhMuc'],
                'TenSanPham' => $validatedData['TenSanPham'],
                'GiaSP' => $validatedData['GiaSP'],
                'GiamGia' => $validatedData['GiamGia'],
                'MoTa' => $validatedData['MoTa'],
                'HinhAnh' => $imageName,
                'TrangThai' => $validatedData['TrangThai'] ?? 1,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thành công',
                'data' => new ServiceResource($product)
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
     *     path="/api/services/destroy/{MaSP}",
     *     tags={"DichVu"},
     *     summary="Xóa dịch vụ",
     *     description="Xóa dịch vụ theo mã dịch vụ (MaSP).",
     *     @OA\Parameter(
     *         name="MaSP",
     *         in="path",
     *         description="Mã dịch vụ cần xóa",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Xóa thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Xóa thành công"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Lỗi chi tiết"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
    public function destroy(string $MaSP)
    {
        //DELETE
        try {
            $product = SanPham::findOrFail($MaSP);
            $path = public_path('image/product');


            $oldFilePath = $path . '/' . $product->HinhAnh;
            // Kiểm tra nếu tệp hình ảnh tồn tại và xóa
            if (file_exists($oldFilePath)) {
                if (unlink($oldFilePath)) {
                    // Nếu xóa hình ảnh thành công, có thể thông báo hoặc ghi log
                    // echo "Xóa hình ảnh thành công.";
                } else {
                    // Nếu không thể xóa hình ảnh
                    return response()->json([
                        'status' => 'fail',
                        'message' => 'Không thể xóa hình ảnh',
                        'data' => null
                    ], 500);
                }
            }
            $product->delete();
            return response()->json([
                'status' => "success",
                'message' => 'Xóa thành công',
                'data' => null,
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
