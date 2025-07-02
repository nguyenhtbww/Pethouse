// src/pages/Info.js

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Info = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <div className="container">
        <p>Người dùng chưa đăng nhập.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <br />
      <div className="card">
        <div className="card-header">Thông Tin Cá Nhân</div>
        <div className="card-body">
          <h7 className="card-title">
            <strong>Tên tài khoản:</strong> {user.Hovaten || "Không có tên"}
          </h7>
          <p className="card-text">
            <strong>Email:</strong> {user.Email || "Không có email"}
          </p>
          <p className="card-text">
            <strong>Số điện thoại:</strong> {user.SDT || "Không có số điện thoại"}
          </p>
          <p className="card-text">
            <strong>Địa chỉ:</strong> {user.DiaChi || "Không có địa chỉ"}
          </p>
          <p className="card-text">
            <strong>Thú cưng:</strong> {user.ThuCung || "Chưa nhập thú cưng"}
          </p>

        </div>
        <div className="card-header">Cài Đặt Tài Khoản</div>
        <div className="card-body">
          <h5 className="card-title">Cập Nhật Tài Khoản Của Bạn</h5>
          <Link to={`/update-info/${user.Mataikhoan}`} className="btn btn-warning mx-2">
            Cập Nhật
          </Link>
          <Link to={`/update-password/${user.Mataikhoan}`} className="btn btn-danger mx-2">
            Đổi mật khẩu<t></t>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Info;
