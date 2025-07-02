<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\NewsResource;
use App\Models\BaiViet;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Schema(
 *     schema="NewsResource",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="Mataikhoan", type="integer", example=1),
 *     @OA\Property(property="MaDMBV", type="integer", example=1),
 *     @OA\Property(property="TieuDe", type="string", example="Bài viết về công nghệ"),
 *     @OA\Property(property="Hinh", type="string", example="https://example.com/image.jpg"),
 *     @OA\Property(property="NoiDung", type="string", example="Đây là nội dung của bài viết."),
 *     @OA\Property(property="ChiTiet", type="string", example="Chi tiết bài viết về công nghệ mới."),
 *     @OA\Property(property="LuotXem", type="integer", example=150),
 *     @OA\Property(property="BinhLuan", type="string", example="20"),
 *     @OA\Property(property="TrangThai", type="string", example=1)
 * )
 */
class NewsApiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/News",
     *     tags={"BaiViet"},
     *     summary="Lấy danh sách  bài viết",
     *     description="Trả về danh sách tất cả các  bài viết.",
     *     @OA\Response(
     *         response=200,
     *         description="Dữ liệu được lấy thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/NewsResource"))
     *         )
     *     ),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */
    public function index()
    {
        // GET
        try {
            $News = BaiViet::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => NewsResource::collection($News)
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
     *     path="/api/News/store",
     *     summary="Thêm mới một bài viết",
     *     description="Tạo một bài viết mới với các thông tin đã được cung cấp",
     *     tags={"BaiViet"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Mataikhoan", "MaDMBV", "TieuDe", "Hinh", "NoiDung", "ChiTiet"},
     *             @OA\Property(property="Mataikhoan", type="integer", example=1),
     *             @OA\Property(property="MaDMBV", type="integer", example=2),
     *             @OA\Property(property="TieuDe", type="string", example="Tiêu đề bài viết"),
     *             @OA\Property(property="Hinh", type="string", example="abc.jpg"),
     *             @OA\Property(property="NoiDung", type="string", example="Nội dung bài viết"),
     *             @OA\Property(property="ChiTiet", type="string", example="Chi tiết bài viết"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/NewsResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi xác thực hoặc lỗi khác",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Thông báo lỗi chi tiết"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */

    public function store(Request $request)
{
    try {
        // Validate dữ liệu
        $validatedData = $request->validate([
            'Mataikhoan' => 'required|exists:users,Mataikhoan',
            'MaDMBV' => 'required|exists:dm_baiviet,MaDMBV',
            'TieuDe' => 'required|string',
            'Hinh' => 'required|image|mimes:jpeg,png,jpg,gif',
            'NoiDung' => 'required|string',
            'ChiTiet' => 'required|string',
        ], [
            // Các thông báo lỗi
        ]);

        // Đường dẫn lưu hình ảnh
        $path = public_path('image/News');

        // Kiểm tra và tạo thư mục nếu không tồn tại
        if (!file_exists($path)) {
            mkdir($path, 0755, true); // Tạo thư mục nếu chưa tồn tại
        }


// Lưu hình ảnh
if ($request->file('Hinh')) {
    $imageName = time() . '.' . $request->file('Hinh')->getClientOriginalExtension();
    $path = public_path('image/News'); // Đường dẫn đến thư mục lưu
    $request->file('Hinh')->move($path, $imageName); // Di chuyển hình ảnh vào thư mục
}
        // Tạo bài viết mới và lưu vào cơ sở dữ liệu
        $news = BaiViet::create([
            'Mataikhoan' => $validatedData['Mataikhoan'],
            'MaDMBV' => $validatedData['MaDMBV'],
            'TieuDe' => $validatedData['TieuDe'],
            'Hinh' => $imageName, // Lưu đường dẫn tương đối
            'NoiDung' => $validatedData['NoiDung'],
            'ChiTiet' => $validatedData['ChiTiet'],
            'LuotXem' => $validatedData['LuotXem'] ?? 0,
            'BinhLuan' => $validatedData['BinhLuan'] ?? 0,
            'TrangThai' => $validatedData['TrangThai'] ?? 1,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm thành công',
            'data' => new NewsResource($news)
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
     *     path="/api/News/{id}",
     *     tags={"BaiViet"},
     *     summary="Lấy thông tin chi tiết bài viết",
     *     description="Trả về thông tin chi tiết của một bài viết cụ thể.",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID của bài viết cần lấy thông tin",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/NewsResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy")
     * )
     */
    public function show($id)
    {
        //GET
        try {
            $news = BaiViet::findOrFail($id);
            // Tăng lượt xem lên 1
            $news->increment('LuotXem');
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => new NewsResource($news)
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
     *     path="/api/News/{id}",
     *     summary="Cập nhật thông tin bài viết",
     *     description="Cập nhật thông tin của một bài viết dựa trên ID.",
     *     operationId="updateNews",
     *     tags={"BaiViet"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID của bài viết cần cập nhật",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Thông tin bài viết mới",
     *         @OA\JsonContent(
     *             required={"Mataikhoan", "MaDMBV", "TieuDe", "Hinh", "NoiDung", "ChiTiet"},
     *             @OA\Property(property="Mataikhoan", type="integer", example=1),
     *             @OA\Property(property="MaDMBV", type="integer", example=1),
     *             @OA\Property(property="TieuDe", type="string", example="viết"),
     *             @OA\Property(property="Hinh", type="string", example="image.jpg"),
     *             @OA\Property(property="NoiDung", type="string", example="Nội dung bài viết"),
     *             @OA\Property(property="ChiTiet", type="string", example="Chi tiết bài viết"),
     *             @OA\Property(property="LuotXem", type="integer", example=100),
     *             @OA\Property(property="BinhLuan", type="string", example="Bình luận bài viết"),
     *             @OA\Property(property="TrangThai", type="integer", example=1),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật bài viết thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="news updated successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/NewsResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi khi cập nhật bài viết",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="message error"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi hệ thống",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        // PUT PATCH
        try {
            $validatedData = $request->validate([
                'Mataikhoan' => 'required|exists:users,Mataikhoan', // Kiểm tra mã tài khoản tồn tại
                'MaDMBV' => 'required|exists:dm_baiviet,MaDMBV', // Kiểm tra mã danh mục tồn tại
                'TieuDe' => 'required|string',
                'Hinh' => 'nullable',
                'NoiDung' => 'required|string', // Nội dung phải là chuỗi ký tự
                'ChiTiet' => 'required|string', // Chi tiết bài viết phải là chuỗi ký tự
            ], [
                'Mataikhoan.required' => 'Vui lòng nhập mã tài khoản',
                'Mataikhoan.exists' => 'Mã tài khoản không tồn tại',
                'MaDMBV.required' => 'Vui lòng nhập mã danh mục',
                'MaDMBV.exists' => 'Mã danh mục không tồn tại',
                'TieuDe.required' => 'Vui lòng nhập tiêu đề bài viết',
                'TieuDe.string' => 'Tiêu đề phải là chuỗi ký tự',
                'Hinh.nullable' => 'Ảnh không bắt buộc',
                'NoiDung.required' => 'Vui lòng nhập nội dung bài viết',
                'NoiDung.string' => 'Nội dung phải là chuỗi ký tự',
                'ChiTiet.required' => 'Vui lòng nhập chi tiết bài viết',
                'ChiTiet.string' => 'Chi tiết bài viết phải là chuỗi ký tự',
            ]);

            // Kiểm tra nếu danh mục tồn tại trước khi cập nhật
            $news = BaiViet::findOrFail($id);
            $imageName = $news->Hinh;

            if ($request->hasFile('Hinh')) {
                $path = public_path('image/News');
                
                // Xóa hình ảnh cũ
                if ($news->Hinh) {
                    $oldFilePath = $path . '/' . $news->Hinh;
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); // Xóa hình cũ
                    }
                }
            
                // Lưu hình ảnh mới
                $imageName = time() . '.' . $request->file('Hinh')->getClientOriginalExtension();
                $request->file('Hinh')->move($path, $imageName);
            }
            $news->update([
                'Mataikhoan' => $validatedData['Mataikhoan'],
                'MaDMBV' => $validatedData['MaDMBV'],
                'TieuDe' => $validatedData['TieuDe'],
                'Hinh' => $imageName,
                'NoiDung' => $validatedData['NoiDung'],
                'ChiTiet' => $validatedData['ChiTiet'],
                'LuotXem' => $validatedData['LuotXem'] ?? 0,
                'BinhLuan' => $validatedData['BinhLuan'] ?? 0,
                'TrangThai' => $validatedData['TrangThai'] ?? 1,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'news updated successfully',
                'data' => new NewsResource($news),
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
     *     path="/api/News/{id}",
     *     tags={"BaiViet"},
     *     summary="Xóa bài viết",
     *     description="Xóa một bài viết theo ID.",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID của bài viết cần xóa",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Xóa thành công"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Lỗi server"
     *     )
     * )
     */
    public function destroy($id)
    {
        //DELETE
        try {
            $category = BaiViet::findOrFail($id);
            $path = public_path('image/News');


            $oldFilePath = $path . '/' . $category->Hinh;
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
            $category->delete();
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
