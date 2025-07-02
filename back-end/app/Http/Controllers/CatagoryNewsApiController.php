<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CatagoryNewsResource;
use App\Models\DanhMucBaiViet;

/**
 * @OA\Schema(
 *     schema="CatagoryNewsResource",
 *     type="object",
 *     @OA\Property(property="MaDMBV", type="integer", example=1),
 *     @OA\Property(property="TenDMBV", type="string", example="Danh mục bài viết 1"),
 * )
 */
class CatagoryNewsApiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/catagorysNews",
     *     tags={"DanhMucBaiViet"},
     *     summary="Lấy danh sách danh mục bài viết",
     *     description="Trả về danh sách tất cả các danh mục bài viết.",
     *     @OA\Response(
     *         response=200,
     *         description="Dữ liệu được lấy thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/CatagoryNewsResource"))
     *         )
     *     ),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */

    public function index()
    {
        // GET
        try {
            $categorysNews = DanhMucBaiViet::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => CatagoryNewsResource::collection($categorysNews)
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
     *     path="/api/catagorysNews/store",
     *     summary="Thêm mới một danh mục bài viết",
     *     description="Tạo một danh mục bài viết mới với các thông tin đã được cung cấp",
     *     tags={"DanhMucBaiViet"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"TenDM"},
     *             @OA\Property(property="TenDMBV", type="string", example="Tên danh mục"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="MaDMBV", type="integer", example=1),
     *                 @OA\Property(property="TenDM", type="string", example="Tên danh mục"),
     *             )
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
        //POST 
        try {
            $validatedData = $request->validate([
                'TenDMBV' => 'required',
            ], [
                'TenDMBV.required' => 'Vui lòng nhập tên danh mục bài viết',
            ]);
            $user = DanhMucBaiViet::Create([
                'TenDMBV' => $request->TenDMBV,
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành công',
                'data' => new CatagoryNewsResource($user)
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
     *     path="/api/catagorysNews/{MaDMBV}",
     *     tags={"DanhMucBaiViet"},
     *     summary="Lấy thông tin danh mục",
     *     description="Trả về thông tin chi tiết của một danh mục cụ thể.",
     *     @OA\Parameter(
     *         name="MaDMBV",
     *         in="path",
     *         required=true,
     *         description="ID của danh mục cần lấy thông tin",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/CatagoryNewsResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy")
     * )
     */
    public function show($MaDMBV)
    {
        //GET
        try {
            $categoryNew = DanhMucBaiViet::findOrFail($MaDMBV);
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => new CatagoryNewsResource($categoryNew)
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
     *     path="/api/catagorysNews/update/{MaDMBV}",
     *     tags={"DanhMucBaiViet"},
     *     summary="Cập nhật danh mục",
     *     description="Cập nhật thông tin của một danh mục cụ thể.",
     *     @OA\Parameter(
     *         name="MaDMBV",
     *         in="path",
     *         required=true,
     *         description="ID của danh mục cần cập nhật",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="TenDMBV", type="string", example="Danh mục mới"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Category updated successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/CatagoryNewsResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi xác thực"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy"),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */
    public function update(Request $request, $MaDMBV)
    {
        // PUT PATCH
        try {
            // Xác thực dữ liệu đầu vào
            $validatedData = $request->validate([
                'TenDMBV' => 'required|string|max:255',  // Thêm xác thực kiểu dữ liệu và độ dài
            ], [
                'TenDMBV.required' => 'Vui lòng nhập tên danh mục bài viết',
                'TenDMBV.string' => 'Tên danh mục phải là chuỗi ',
                'TenDMBV.max' => 'Tên danh phải ít hơn 255 ký tự',
            ]);
    
            // Tìm danh mục theo ID, nếu không tìm thấy sẽ trả về lỗi 404
            $category = DanhMucBaiViet::findOrFail($MaDMBV);
    
            // Cập nhật thông tin danh mục
            $category->update([
                'TenDMBV' => $request->TenDMBV,
            ]);
    
            // Trả về phản hồi thành công
            return response()->json([
                'status' => 'success',
                'message' => 'Category updated successfully',
                'data' => new CatagoryNewsResource($category),
            ], 200);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Xử lý khi không tìm thấy danh mục
            return response()->json([
                'status' => 'fail',
                'message' => 'Danh mục không tìm thấy',
                'data' => null
            ], 404);
        } catch (\Exception $e) {
            // Xử lý các lỗi khác
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

/**
 * @OA\Delete(
 *     path="/api/catagorysNews/destroy/{MaDMBV}",
 *     tags={"DanhMucBaiViet"},
 *     summary="Xóa danh mục",
 *     description="Xóa một danh mục theo ID.",
 *     @OA\Parameter(
 *         name="MaDMBV",
 *         in="path",
 *         required=true,
 *         description="ID của danh mục cần xóa",
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
public function destroy($MaDMBV)
{
    //DELETE
    try {
        $category = DanhMucBaiViet::findOrFail($MaDMBV);
        $category->delete();

        return response()->json(null, 204);  // Trả về mã 204 mà không cần dữ liệu
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'fail',
            'message' => $e->getMessage(),
            'data' => null
        ], 500);
    }
}
}
