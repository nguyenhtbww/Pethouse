// src/pages/UpdateInfo.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateInfo = () => {
  const { id } = useParams(); // Lấy id (Mataikhoan) từ URL
  const { user, isLoggedIn, setUser } = useAuth(); // Lấy dữ liệu người dùng và setUser từ AuthContext
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    Hovaten: "",
    Email: "",
    SDT: "",
    DiaChi: "",
    ThuCung: "", // Thêm trường ThuCung nếu cần
  });

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa đăng nhập hoặc mã tài khoản không hợp lệ
    if (!isLoggedIn || id !== String(user?.Mataikhoan)) {
      alert("Mã tài khoản không hợp lệ hoặc người dùng chưa đăng nhập.");
      return;
    }

    // Cập nhật thông tin người dùng vào form khi người dùng đã đăng nhập
    if (user) {
      setUserInfo({
        Hovaten: user.Hovaten || "",
        Email: user.Email || "",
        SDT: user.SDT || "",
        DiaChi: user.DiaChi || "",
        ThuCung: user.ThuCung || "",
      });
    }
  }, [id, user, isLoggedIn]);

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi yêu cầu PUT để cập nhật thông tin người dùng
    fetch(`http://127.0.0.1:8000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo), // Gửi toàn bộ thông tin đã thay đổi
    })
      .then((response) => response.json())
      .then((data) => {
        // Cập nhật thông tin người dùng vào AuthContext và sessionStorage
        const updatedUser = data.user;
        setUser(updatedUser); // Cập nhật trong AuthContext
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Lưu lại vào sessionStorage
        alert("Cập nhật thông tin thành công!");
        navigate("/info");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật dữ liệu người dùng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      });
  };

  return (


    <div className="container my-5">




      <div className="card mx-5">
        <div className="card-header text-center" style={{backgroundColor:"#f4b915", color:"white"}}>
          <h2>Cập Nhật Thông Tin Tài Khoản</h2>
        </div>
        <div className="card-body px-5" >
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Nhóm 1: Thông tin cơ bản - Cột 1 */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Tên tài khoản</label>
                  <input
                    type="text"
                    name="Hovaten"
                    className="form-control"
                    value={userInfo.Hovaten}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="Email"
                    className="form-control"
                    value={userInfo.Email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="SDT"
                    className="form-control"
                    value={userInfo.SDT}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Nhóm 2: Thông tin thêm - Cột 2 */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="DiaChi"
                    className="form-control"
                    value={userInfo.DiaChi}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Thú Cưng</label>
                  <input
                    type="text"
                    name="ThuCung"
                    className="form-control"
                    value={userInfo.ThuCung}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-warning text-light">
              Cập Nhật
            </button>
          </form>

        </div>
      </div>





    </div>
  );
};

export default UpdateInfo;