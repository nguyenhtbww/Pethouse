<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use App\Models\LienHe;
use App\Http\Resources\ContactResource;

/**
 * @OA\Schema(
 *     schema="ContactResource",
 *     type="object",
 *     @OA\Property(property="MaLienHe", type="integer", example=1),
 *     @OA\Property(property="TieuDe", type="string", example="Liên hệ 1"),
 *     @OA\Property(property="HoVaTen", type="string", example="Võ Hùng Vĩ"),
 *     @OA\Property(property="SoDienThoai", type="string", example="0962491715"),
 *     @OA\Property(property="Email", type="string", example="vohungvi24@gmail.com"),
 *     @OA\Property(property="NoiDung", type="string", example="Nội dung liên hệ")
 * )
 */
class ContactApiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/contacts",
     *     tags={"LienHe"},
     *     summary="Lấy danh sách liên hệ",
     *     description="Trả về danh sách tất cả các liên hệ.",
     *     @OA\Response(
     *         response=200,
     *         description="Dữ liệu được lấy thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu được lấy thành công"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/ContactResource"))
     *         )
     *     ),
     *     @OA\Response(response=500, description="Lỗi server")
     * )
     */
    public function index()
    {
        try {
            $contacts = LienHe::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => ContactResource::collection($contacts)
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
     *     path="/api/contacts/store",
     *     tags={"LienHe"},
     *     summary="Thêm liên hệ mới",
     *     description="Tạo một liên hệ mới và trả về thông tin của liên hệ vừa được tạo.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="TieuDe", type="string", example="Hỏi về sản phẩm"),
     *             @OA\Property(property="HoVaTen", type="string", example="Nguyễn Văn A"),
     *             @OA\Property(property="SoDienThoai", type="string", example="0912345678"),
     *             @OA\Property(property="Email", type="string", example="nguyenvana@example.com"),
     *             @OA\Property(property="NoiDung", type="string", example="Xin cho tôi biết thêm thông tin về sản phẩm.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ContactResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi yêu cầu",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Chi tiết lỗi"),
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
                'TieuDe' => 'required|string',
                'HoVaTen' => 'required|string',
                'SoDienThoai' => 'required|string',
                'Email' => 'required|string|email',
                'NoiDung' => 'required|string'
            ], [
                'TieuDe.required' => 'Tiêu đề không được để trống.',
                'HoVaTen.required' => 'Họ và tên không được để trống.',
                'SoDienThoai.required' => 'Số điện thoại không được để trống.',
                'Email.required' => 'Email không được để trống.',
                'Email.email' => 'Email phải đúng định dạng.',
                'NoiDung.required' => 'Nội dung không được để trống.'
            ]);
            $user = LienHe::create($validatedData);
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành công',
                'data' => new ContactResource($user)
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
     *     path="/api/contacts/{MaLienHe}",
     *     tags={"LienHe"},
     *     summary="Lấy thông tin chi tiết liên hệ",
     *     description="Trả về thông tin chi tiết của một liên hệ cụ thể.",
     *     @OA\Parameter(
     *         name="MaLienHe",
     *         in="path",
     *         required=true,
     *         description="ID của liên hệ cần lấy thông tin",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ContactResource")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy")
     * )
     */
    public function show($MaLienHe)
    {
        //GET
        try {
            $contact = LienHe::findOrFail($MaLienHe);
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => new ContactResource($contact)
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
     *     path="/api/contacts/update/{MaLienHe}",
     *     tags={"LienHe"},
     *     summary="Cập nhật thông tin liên hệ",
     *     description="Cập nhật thông tin của một liên hệ theo mã liên hệ đã cho.",
     *     @OA\Parameter(
     *         name="MaLienHe",
     *         in="path",
     *         required=true,
     *         description="Mã liên hệ cần cập nhật",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="TieuDe", type="string", example="Hỏi về dịch vụ"),
     *             @OA\Property(property="HoVaTen", type="string", example="Nguyễn Văn B"),
     *             @OA\Property(property="SoDienThoai", type="string", example="0987654321"),
     *             @OA\Property(property="Email", type="string", example="nguyenvanb@example.com"),
     *             @OA\Property(property="NoiDung", type="string", example="Tôi muốn biết thêm thông tin chi tiết.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Cập nhật thành công"),
     *             @OA\Property(property="data", ref="#/components/schemas/ContactResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi yêu cầu",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Chi tiết lỗi"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy liên hệ",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Không tìm thấy liên hệ"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $MaLienHe)
    {
        // PUT
        try {
            $validatedData = $request->validate([
                'TieuDe' => 'required|string',
                'HoVaTen' => 'required|string',
                'SoDienThoai' => 'required|string',
                'Email' => 'required|string|email',
                'NoiDung' => 'required|string'
            ], [
                'TieuDe.required' => 'Tiêu đề không được để trống.',
                'HoVaTen.required' => 'Họ và tên không được để trống.',
                'SoDienThoai.required' => 'Số điện thoại không được để trống.',
                'Email.required' => 'Email không được để trống.',
                'Email.email' => 'Email phải đúng định dạng.',
                'NoiDung.required' => 'Nội dung không được để trống.'
            ]);

            $contact = LienHe::findOrFail($MaLienHe);
            $contact->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thành công',
                'data' => new ContactResource($contact)
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
     *     path="/api/contacts/destroy/{MaLienHe}",
     *     tags={"LienHe"},
     *     summary="Xóa liên hệ",
     *     description="Xóa một liên hệ theo ID.",
     *     @OA\Parameter(
     *         name="MaLienHe",
     *         in="path",
     *         required=true,
     *         description="ID của liên hệ cần xóa",
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
    public function destroy($MaLienHe)
    {
        //DELETE
        try {
            $category = LienHe::findOrFail($MaLienHe);
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
