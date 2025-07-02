<?php

// UserApiController.php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use App\Models\DanhMuc;
use App\Http\Resources\CategoryResource;

/**
 * @OA\Schema(
 *     schema="CategoryResource",
 *     type="object",
 *     @OA\Property(property="MaDanhMuc", type="integer", example=1),
 *     @OA\Property(property="TenDM", type="string", example="Danh mục 1"),
 *     @OA\Property(property="parent_id", type="integer", example=null),
 *     @OA\Property(property="loai", type="integer", example=0)
 * )
 */
class CategoryApiController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/category",
     *     tags={"DanhMuc"},
     *     summary="Lấy danh sách danh mục",
     *     description="Trả về danh sách tất cả các danh mục.",
     *     @OA\Response(
     *         response=200,
     *         description="Dữ liệu được lấy thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/CategoryResource"))
     *         )
     *     ),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */
    public function index()
    {
        // GET
        try {
            $categorys = DanhMuc::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => CategoryResource::collection($categorys)
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
     *     path="/api/category/store",
     *     summary="Thêm mới một danh mục",
     *     description="Tạo một danh mục mới với các thông tin đã được cung cấp",
     *     tags={"DanhMuc"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"TenDM"},
     *             @OA\Property(property="TenDM", type="string", example="Tên danh mục"),
     *             @OA\Property(property="parent_id", type="integer", example=1, nullable=true),
     *             @OA\Property(property="loai", type="string", example="0", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="TenDM", type="string", example="Tên danh mục"),
     *                 @OA\Property(property="parent_id", type="integer", example=1, nullable=true),
     *                 @OA\Property(property="loai", type="string", example="loại sản phẩm", nullable=true)
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
                'TenDM' => 'required',
                'parent_id' => [
                    'nullable',
                    'exists:danh_muc,MaDanhMuc',
                    function ($attribute, $value, $fail) {
                        // Kiểm tra xem danh mục có parent_id là null không
                        $isDanhMucChinh = DB::table('danh_muc')
                            ->where('MaDanhMuc', $value)
                            ->whereNull('parent_id')
                            ->exists();

                        if (!$isDanhMucChinh) {
                            $fail('Không có danh mục chính');
                        }
                    }
                ],
                'loai' => 'nullable|string|in:0,1' // chỉ chấp nhận 0 hoặc 1 nếu có giá trị
            ], [
                'TenDM.required' => 'Vui lòng nhập tên danh mục',
                'parent_id.exists' => 'Danh mục cha không tồn tại',
                'loai.in' => 'Loại danh mục phải là 0 hoặc 1'
            ]);
            $user = DanhMuc::Create([
                'TenDM' => $request->TenDM,
                'parent_id' => $request->parent_id ?? null, // nếu không có giá trị thì để null
                'loai' => $request->loai ?? 0, // nếu không có giá trị thì để 0
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành công',
                'data' => new CategoryResource($user)
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
     *     path="/api/category/{MaDanhMuc}",
     *     tags={"DanhMuc"},
     *     summary="Lấy thông tin danh mục",
     *     description="Trả về thông tin chi tiết của một danh mục cụ thể.",
     *     @OA\Parameter(
     *         name="MaDanhMuc",
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
     *             @OA\Property(property="data", ref="#/components/schemas/CategoryResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy")
     * )
     */
    public function show($MaDanhMuc)
    {
        //GET
        try {
            $category = DanhMuc::findOrFail($MaDanhMuc);
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => new CategoryResource($category)
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
     *     path="/api/category/update/{MaDanhMuc}",
     *     tags={"DanhMuc"},
     *     summary="Cập nhật danh mục",
     *     description="Cập nhật thông tin của một danh mục cụ thể.",
     *     @OA\Parameter(
     *         name="MaDanhMuc",
     *         in="path",
     *         required=true,
     *         description="ID của danh mục cần cập nhật",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="TenDM", type="string", example="Danh mục mới"),
     *             @OA\Property(property="parent_id", type="integer", example=null),
     *             @OA\Property(property="loai", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Category updated successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/CategoryResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi xác thực"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy"),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */
    public function update(Request $request, $MaDanhMuc)
    {
        // PUT PATCH
        try {
            $request['loai'] = (string) $request->loai; // Chuyển đổi thành chuỗi trước khi xác thực
            $validatedData = $request->validate([
                'TenDM' => 'required',
                'parent_id' => [
                    'nullable',
                    'exists:danh_muc,MaDanhMuc',
                    function ($attribute, $value, $fail) {
                        $isDanhMucChinh = DB::table('danh_muc')
                            ->where('MaDanhMuc', $value)
                            ->whereNull('parent_id')
                            ->exists();

                        if (!$isDanhMucChinh) {
                            $fail('Không có danh mục chính');
                        }
                    }
                ],
                'loai' => 'nullable|string|in:0,1' // chỉ chấp nhận 0 hoặc 1
            ], [
                'TenDM.required' => 'Vui lòng nhập tên danh mục',
                'parent_id.exists' => 'Danh mục cha không tồn tại',
                'loai.in' => 'Loại danh mục phải là 0 hoặc 1'
            ]);

            // Kiểm tra nếu danh mục tồn tại trước khi cập nhật
            $category = DanhMuc::findOrFail($MaDanhMuc);
            $category->update([
                'TenDM' => $request->TenDM,
                'parent_id' => $request->parent_id ?? null,
                'loai' => $request->loai ?? 0,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Category updated successfully',
                'data' => new CategoryResource($category),
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
     *     path="/api/category/destroy/{MaDanhMuc}",
     *     tags={"DanhMuc"},
     *     summary="Xóa danh mục",
     *     description="Xóa một danh mục theo ID.",
     *     @OA\Parameter(
     *         name="MaDanhMuc",
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
    public function destroy($MaDanhMuc)
    {
        //DELETE
        try {
            $category = DanhMuc::findOrFail($MaDanhMuc);
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
