<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Mail\SendEmail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\UserResource;

/**
 * @OA\Info(
 *     title="API Documentation",
 *     version="1.0.0",
 *     description="API documentation for the application",
 * )
 */

class UserController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/users",
     *     tags={"Users"},
     *     summary="Lấy danh sách tài khoản",
     *     description="Trả về danh sách tất cả các tài khoản.",
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *          
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy")
     * )
     */
    public function index()
    {
        // GET
        try {
            $users = User::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu được lấy thành công',
                'data' => UserResource::collection($users)
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
     *     path="/api/dangnhap",
     *     summary="Đăng nhập tài khoản",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Email", "Matkhau"},
     *             @OA\Property(property="Email", type="string", format="email", example="truongminhthien222004@gmail.com"),
     *             @OA\Property(property="Matkhau", type="string", format="password", example="thien123"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string", example="1|abc123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function dangnhap(Request $request)
    {
        // Validate input
        $credentials = Validator::make($request->all(), [
            'Email' => 'required|email',
            'Matkhau' => 'required|string',
        ]);

        if ($credentials->fails()) {
            return response()->json($credentials->errors(), 400);
        }

        $user = User::where('Email', $request->Email)->first();

        $canlogin = false;
        if ($user) {
            $canlogin = Hash::check($request->Matkhau, $user->Matkhau);
        }
        if ($canlogin) {
            Auth::login($user);
            return response()->json([
                'message' => 'Đăng nhập thành công!',
                'user' => Auth::user()
            ], 201);
        } else {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng!',
                'user' => $user,
            ], 400);
        }
    }




    /**
     * Thêm mới một người dùng
     * 
     * @OA\Post(
     *     path="/api/dangki",
     *     summary="Đăng kí tài khoản",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Hovaten", "Email", "DiaChi", "SDT", "Matkhau",},
     *             @OA\Property(property="Hovaten", type="string", example="Trương Minh Thiện"),
     *             @OA\Property(property="Email", type="string", format="email", example="truongminhthien222004@gmail.com"),
     *             @OA\Property(property="Matkhau", type="string", format="password", example="thien123"),
     *             @OA\Property(property="SDT", type="string", example="0354895845"),
     *             @OA\Property(property="DiaChi", type="string", example="294 -296 Đồng Đen - Quận Tân Bình - Hồ Chí Minh"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Người dùng đã đăng kí thành công tài khoản",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User created successfully"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Dữ liệu không hợp lệ"
     *     )
     * )
     */
    public function dangki(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'Hovaten' => 'required|string|max:255',
            'SDT' => 'required|string|max:255',
            'DiaChi' => 'required|string|max:255',
            'Email' => 'required|string|email|max:255|unique:users',
            'Matkhau' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        // Tạo người dùng mới
        $user = User::create([
            'Hovaten' => $request->Hovaten,
            'SDT' => $request->SDT,
            'Email' => $request->Email,
            'DiaChi' => $request->DiaChi,
            'Quyen' => 0,
            'Matkhau' => Hash::make($request->Matkhau),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Thêm mới một người dùng
     * 
     * @OA\Post(
     *     path="/api/guiemail",
     *     summary="Gữi email cấp lại mật khẩu",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Email" },
     *             @OA\Property(property="Email", type="string", format="email", example="truongminhthien222004@gmail.com"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Gữi email đặt lại mật khẩu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Gữi email đặt lại mật khẩu thành công"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Dữ liệu không hợp lệ"
     *     )
     * )
     */
    public function GuiEmail(Request $request)
    {
        $request->validate([
            'Email' => 'required|email|max:255',
        ], [
            'Email.required' => 'Email là bắt buộc.',
            'Email.email' => 'Email không đúng định dạng.',
            'Email.max' => 'Email không được vượt quá :max ký tự.',
        ]);

        $user = User::where('Email', $request->Email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Email không phải email đăng ký tài khoản của bạn!',
            ], 400);
        } else {
            $token = Str::random(40) . bcrypt($user->Mataikhoan);
            $token = str_replace('/', '', $token);
            $user->update(['remember_token' => $token]);

            if ($user->wasChanged('remember_token')) {
                $subject = 'Đặt lại mật khẩu của bạn';
                $resetLink = env('FRONTEND_URL') . '/ResetPassword?token=' . $token;
                Mail::to($user->Email)->send(new SendEmail($subject, ['name' => $user->Hovaten, 'link' => $resetLink]));
                return response()->json([
                    'message' => 'Email hoặc mật khẩu không đúng!',
                    'user' => $user,
                    'token' => $token
                ], 200);
            }
        }
    }

    public function resetPassword(Request $request)
    {
        // Lấy token từ body
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token không hợp lệ hoặc không tồn tại.',
            ], 400);
        }

        // Validate password
        $request->validate([
            'password' => 'required|confirmed|min:8',
        ]);

        // Tìm user bằng token
        $user = User::where('remember_token', $token)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token không hợp lệ hoặc đã hết hạn.',
            ], 400);
        }

        // Đổi mật khẩu và xóa token
        $user->Matkhau = Hash::make($request->password);
        $user->remember_token = null; // Xóa token sau khi sử dụng
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Đổi mật khẩu thành công.',
        ], 200);
    }


    /**
     * @OA\Post(
     *     path="/api/users/store",
     *     summary="Thêm mới người dùng",
     *     description="Thêm một người dùng mới vào hệ thống với thông tin đầy đủ.",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"Hovaten", "ThuCung", "SDT", "DiaChi", "Email", "Quyen", "Matkhau"},
     *             @OA\Property(property="Hovaten", type="string", example="Nguyen Van Vĩ"),
     *             @OA\Property(property="ThuCung", type="string", example="Chó"),
     *             @OA\Property(property="SDT", type="string", example="0362109871"),
     *             @OA\Property(property="DiaChi", type="string", example="123 Đường ABC, Quận 1, TP.HCM"),
     *             @OA\Property(property="Email", type="string", format="email", example="vohungvi02@gmail.com"),
     *             @OA\Property(property="Quyen", type="integer", enum={0, 1}, example=1),
     *             @OA\Property(property="Matkhau", type="string", format="password", example="0")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm mới thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Thêm thành công"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="Mataikhoan", type="integer", example=1),
     *                 @OA\Property(property="Hovaten", type="string", example="Nguyen Van Vĩ"),
     *                 @OA\Property(property="ThuCung", type="string", example="Chó"),
     *                 @OA\Property(property="SDT", type="string", example="0362189871"),
     *                 @OA\Property(property="DiaChi", type="string", example="123 Đường ABC, Quận 1, TP.HCM"),
     *                 @OA\Property(property="Email", type="string", example="vohungvi02@gmail.com"),
     *                 @OA\Property(property="Quyen", type="integer", example=0),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-12-01T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-12-01T10:00:00Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Yêu cầu không hợp lệ",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu không hợp lệ."),
     *             @OA\Property(property="data", type="null")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Lỗi xác thực",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="fail"),
     *             @OA\Property(property="message", type="string", example="Dữ liệu không hợp lệ."),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="Hovaten", type="array",
     *                     @OA\Items(type="string", example="Họ và tên không được để trống.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            // Validate dữ liệu từ request
            $validatedData = $request->validate([
                'Hovaten' => 'required|string|max:255',
                'SDT' => 'required|regex:/^0\d{9}$/', // Số điện thoại chỉ cần bắt đầu bằng 0 và có đúng 10 số
                'Email' => 'required|string|email|max:255',
                'ThuCung' => 'string|max:255',
                'DiaChi' => 'required|string|max:255',
                'Quyen' => 'required|integer|in:0,1', // Chỉ chấp nhận 0 hoặc 1
                'Matkhau' => 'required|string|max:255',
            ], [
                'Hovaten.required' => 'Họ và tên không được để trống.',
                'Hovaten.string' => 'Họ và tên phải là chuỗi ký tự.',
                'Hovaten.max' => 'Họ và tên không được vượt quá 255 ký tự.',

                'ThuCung.string' => 'Tên thú cưng phải là chuỗi ký tự.',
                'ThuCung.max' => 'Tên thú cưng không được vượt quá 255 ký tự.',

                'SDT.required' => 'Số điện thoại không được để trống.',
                'SDT.regex' => 'Số điện thoại phải bắt đầu bằng 03, 05, 07, 08, 09 và có từ 10 chữ số.',

                'DiaChi.required' => 'Địa chỉ không được để trống.',
                'DiaChi.string' => 'Địa chỉ phải là chuỗi ký tự.',
                'DiaChi.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

                'Email.required' => 'Email không được để trống.',
                'Email.string' => 'Email phải là chuỗi ký tự.',
                'Email.email' => 'Email phải có định dạng hợp lệ.',
                'Email.max' => 'Email không được vượt quá 255 ký tự.',

                'Quyen.required' => 'Quyền không được để trống.',
                'Quyen.integer' => 'Quyền phải là số nguyên.',
                'Quyen.in' => 'Quyền chỉ có thể là 0 hoặc 1.',

                'Matkhau.required' => 'Mật khẩu không được để trống.',
                'Matkhau.string' => 'Mật khẩu phải là chuỗi ký tự.',
                'Matkhau.max' => 'Mật khẩu không được vượt quá 255 ký tự.',
            ]);

            // Mã hóa mật khẩu trước khi lưu
            $validatedData['Matkhau'] = Hash::make($validatedData['Matkhau']);


            // Tạo mới người dùng
            $user = User::create($validatedData);

            // Trả về phản hồi thành công
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành công',
                'data' => new UserResource($user),
            ], 201);
        } catch (\Exception $e) {
            // Xử lý lỗi
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null,
            ], 400);
        }
    }


    /**
     * Xóa một người dùng
     * 
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     summary="Xóa người dùng",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="ID của người dùng"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Người dùng đã bị xóa",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy người dùng"
     *     )
     * )
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }



    /**
     * Cập nhật thông tin người dùng
     * 
     * @OA\Put(
     *     path="/api/users/update/{Mataikhoan}",
     *     summary="Cập nhật thông tin người dùng",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="Mataikhoan",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="ID của người dùng"
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"ThuCung", "Hovaten", "Email", "DiaChi", "SDT", "Matkhau",},
     *             @OA\Property(property="Hovaten", type="string", example="Trương Minh Thiện"),
     *             @OA\Property(property="Email", type="string", format="email", example="truongminhthien222004@gmail.com"),
     *             @OA\Property(property="ThuCung", type="string", example="Chó"),
     *             @OA\Property(property="SDT", type="string", example="0354895845"),
     *             @OA\Property(property="DiaChi", type="string", example="294 -296 Đồng Đen - Quận Tân Bình - Hồ Chí Minh"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Người dùng đã được cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Cập nhật thành công"),
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy người dùng"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Dữ liệu không hợp lệ"
     *     )
     * )
     */
    public function update(Request $request, $Mataikhoan)
    {
        // Kiểm tra người dùng có tồn tại không
        $user = User::find($Mataikhoan);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'Hovaten' => 'required|string|max:255',
            'ThuCung' => 'required|string|max:255',
            'SDT' => 'required|string|max:255',
            'DiaChi' => 'required|string|max:255',
            'Email' => 'required|string|email|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        } else {
            // Cập nhật thông tin người dùng
            $user->Hovaten = $request->Hovaten;
            $user->SDT = $request->SDT;
            $user->DiaChi = $request->DiaChi;
            $user->Email = $request->Email;
            $user->ThuCung = $request->ThuCung;

            $user->save();

            return response()->json([
                'message' => 'Cập nhật tài khoản thành công!',
                'status' => true,
                'user' => $user
            ], 200);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/users/doiMatKhau/{Mataikhoan}",
     *     tags={"Users"},
     *     summary="Đổi mật khẩu người dùng",
     *     description="Đổi mật khẩu cho người dùng bằng cách kiểm tra mật khẩu cũ",
     *     @OA\Parameter(
     *         name="Mataikhoan",
     *         in="path",
     *         description="ID tài khoản người dùng",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"OldPassword", "Matkhau"},
     *             @OA\Property(property="OldPassword", type="string", description="Mật khẩu cũ"),
     *             @OA\Property(property="Matkhau", type="string", description="Mật khẩu mới")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Đổi mật khẩu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Đổi mật khẩu thành công!"),
     *             @OA\Property(property="status", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Lỗi đầu vào",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Mật khẩu cũ không đúng")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy người dùng",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function doiMatKhau(Request $request, $Mataikhoan)
    {
        // Kiểm tra người dùng có tồn tại không
        $user = User::find($Mataikhoan);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'OldPassword' => 'required|string|max:255',
            'Matkhau' => 'required|string|max:255|min:8|different:OldPassword', // Mật khẩu mới không trùng với mật khẩu cũ
        ],[
            'OldPassword.required' => 'Vui lòng nhập mật khẩu cũ',
            'Matkhau.different' => 'Mật khẩu mới không được trùng với mật khẩu cũ',
            'Matkhau.min' => 'Mật khẩu phải nhiều hơn 8 ký tự',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Kiểm tra mật khẩu cũ
        if (!Hash::check($request->OldPassword, $user->Matkhau)) {
            return response()->json(['message' => 'Mật khẩu cũ không đúng'], 400);
        }

        // Cập nhật mật khẩu mới
        $user->Matkhau = Hash::make($request->Matkhau);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công!',
            'status' => true,
        ], 200);
    }



    /**
     * Cập nhật thông tin người dùng
     * 
     * @OA\Put(
     *     path="/api/users/updateAdmin/{Mataikhoan}",
     *     summary="Cập nhật thông tin người dùng cho admin",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="Mataikhoan",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="ID của người dùng"
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"ThuCung", "Hovaten", "Email", "DiaChi", "SDT", "Matkhau",},
     *             @OA\Property(property="Hovaten", type="string", example="Nguyen van A"),
     *             @OA\Property(property="Email", type="string", format="email", example="naguyen@gmail.com"),
     *             @OA\Property(property="Quyen", type="string", format="Quyen", example="0"),
     *             @OA\Property(property="ThuCung", type="string", example="Chó"),
     *             @OA\Property(property="SDT", type="string", example="0123456789"),
     *             @OA\Property(property="DiaChi", type="string", example="294 -296 Đồng Đen - Quận Tân Bình - Hồ Chí Minh"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Người dùng đã được cập nhật thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Cập nhật thành công"),
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Không tìm thấy người dùng"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Dữ liệu không hợp lệ"
     *     )
     * )
     */
    public function updateAdmin(Request $request, $Mataikhoan)
    {
        // Kiểm tra người dùng có tồn tại không
        $user = User::find($Mataikhoan);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'Hovaten' => 'required|string|max:255',
            'ThuCung' => 'required|string|max:255',
            'SDT' => 'required|string|max:255',
            'Quyen' => 'required|string|max:255',
            'DiaChi' => 'required|string|max:255',
            'Email' => 'required|string|email|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        } else {
            // Cập nhật thông tin người dùng
            $user->Hovaten = $request->Hovaten;
            $user->SDT = $request->SDT;
            $user->Quyen = $request->Quyen;
            $user->DiaChi = $request->DiaChi;
            $user->Email = $request->Email;
            $user->ThuCung = $request->ThuCung;

            $user->save();

            return response()->json([
                'message' => 'Cập nhật tài khoản thành công!',
                'status' => true,
                'user' => $user
            ], 200);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/users/show/{Mataikhoan}",
     *     tags={"Users"},
     *     summary="Lấy thông tin tài khoản",
     *     description="Trả về thông tin chi tiết của một danh mục cụ thể.",
     *     @OA\Parameter(
     *         name="Mataikhoan",
     *         in="path",
     *         required=true,
     *         description="ID user cần lấy",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lấy dữ liệu thành công",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lấy dữ liệu thành công"),
     *          
     *         )
     *     ),
     *     @OA\Response(response=400, description="Lỗi khi lấy dữ liệu"),
     *     @OA\Response(response=404, description="Danh mục không tìm thấy")
     * )
     */

    public function show($Mataikhoan)
    {
        //GET
        try {
            $user = User::findOrFail($Mataikhoan);
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu thành công',
                'data' => new UserResource($user)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }
}
