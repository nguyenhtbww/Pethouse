import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ResetPassword() {
    const location = useLocation();  // Lấy thông tin về URL hiện tại
    const queryParams = new URLSearchParams(location.search);  // Lấy query parameters từ URL
    const token = queryParams.get("token");  // Lấy giá trị token từ URL

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Kiểm tra token có hợp lệ không
    if (!token) {
        return <div>Token không hợp lệ hoặc không tồn tại.</div>;
    }

    // Xử lý gửi yêu cầu đổi mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setMessage("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/ResetPassword", {
                password,
                password_confirmation: passwordConfirmation,
                token,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4 text-center m-5">

                        <div class="card text-center">
                            <div class="card-header">
                                <h3 className="">Đặt lại mật khẩu</h3>
                            </div>
                            <div class="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3 rounded">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Mật khẩu mới"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            name="passwordConfirmation"
                                            placeholder="Xác nhận mật khẩu"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                    </button>
                                    {message && <div>{message}</div>}
                                </form>
                            </div>
                     
                        </div>




                        
                    </div>
                </div>


            </div>
        </div>
    );
}

export default ResetPassword;
