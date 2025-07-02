import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function AdminTaiKhoanThem() {
  const { user } = useAuth();
  const [hovaten, setHovaten] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [quyen, setQuyen] = useState(0);
  const [diachi, setDiachi] = useState("");
  const [thucung, setThucung] = useState("");
  const [matkhau, setMatkhau] = useState("");  // Thêm state cho mật khẩu
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dữ liệu người dùng
    const userData = {
      Hovaten: hovaten,
      SDT: sdt,
      Email: email,
      DiaChi: diachi,
      Quyen: quyen,
      ThuCung: thucung,
      Matkhau: matkhau,  // Thêm mật khẩu vào dữ liệu
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,  // Nếu cần token xác thực
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Tạo tài khoản thành công!");
        navigate("/admintaikhoan"); // Chuyển hướng về trang danh sách tài khoản
      } else {
        const data = await response.json();
        alert(data.message || "Đã xảy ra lỗi khi tạo tài khoản");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Lỗi kết nối với server.");
    }
  };

  return (
    <div className="container-fluid admintrangchu">
      <div className="row">
        <div
          id="openMenu"
          className="col-md-2 p-0 bg-primary collapse collapse-horizontal show"
          style={{ minHeight: "100vh" }}
        >
          <Link to={"/"}>
            <img
              src={`http://localhost:8000/image/Nen_trong_suot.png`}
              className="d-block w-75 mx-auto"
              alt="Logo"
            />
          </Link>

          <div className="list-group list-group-item-primary">
            <Link
              to={"/admin"}
              className="list-group-item list-group-item-action mt-2 mb-0 rounded-0"
              aria-current="true"
            >
              <h5 className="mb-0 py-1">Tổng quan</h5>
            </Link>
            <Link
              to={"/adminsanpham"}
              className="list-group-item list-group-item-action my-0  rounded-0"
            >
              <h5 className="mb-0 py-1">Sản phẩm</h5>
            </Link>
            <Link
              to={"/admindichvuchamsoc"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Dịch vụ chăm sóc</h5>
            </Link>
            <Link
              to={"/admindanhmuc"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Danh mục</h5>
            </Link>
            <Link
              to={"/admintaikhoan"}
              className="list-group-item list-group-item-action my-0 rounded-0 active"
            >
              <h5 className="mb-0 py-1">Tài khoản</h5>
            </Link>
            <Link
              to={"/admindonhang"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Đơn hàng</h5>
            </Link>
            <Link
              to={"/admindatlich"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Đặt lịch</h5>
            </Link>
            <Link
              to={"/Admin_BV"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Tin tức</h5>
            </Link>
            <Link
              to={"/adminlienhe"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Liên hệ</h5>
            </Link>
            <Link
              to={"/adminmagiamgia"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Mã giảm giá</h5>
            </Link>
          </div>
        </div>

        <div className="col-md p-0">
          <nav
            className="navbar navbar-expand-lg bg-primary p-0"
            data-bs-theme="dark"
          >
            <div className="container-fluid">
              <button
                className="btn btn-outline-light me-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#openMenu"
                aria-expanded="false"
                aria-controls="collapseWidthExample"
              >
                <i className="bi bi-list"></i>
              </button>
              <a className="navbar-brand" href="/#">
                PetHouse
              </a>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Xin chào, {user.Hovaten || "Không có tên"}
                    </a>
                    <ul className="dropdown-menu bg-primary p-0 mt-0 border-0 rounded-0">
                      <li className="rounded-0">
                        <Link
                          className="menu-header-top dropdown-item m-0 py-2"
                          to={"/"}
                        >
                          Xem trang chủ
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider m-0" />
                      </li>
                      <li>
                        <a
                          className="menu-header-bottom dropdown-item m-0 py-2"
                          href="/#"
                        >
                          Đăng xuất
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="container">
  <h2 className="my-3">Thêm tài khoản</h2>

  <form onSubmit={handleSubmit}>
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label htmlFor="SoDienThoai" className="form-label">
            Số điện thoại
          </label>
          <input
            type="text"
            className="form-control"
            id="SoDienThoai"
            value={sdt}
            onChange={(e) => setSdt(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="HoTen" className="form-label">
            Họ và tên
          </label>
          <input
            type="text"
            className="form-control"
            id="HoTen"
            value={hovaten}
            onChange={(e) => setHovaten(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Quyen" className="form-label">
            Quyền
          </label>
          <select
            className="form-select"
            value={quyen}
            onChange={(e) => setQuyen(Number(e.target.value))}
          >
            <option value="0">Người dùng</option>
            <option value="1">Quản trị viên</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="DiaChi" className="form-label">
            Địa chỉ
          </label>
          <input
            type="text"
            className="form-control"
            id="DiaChi"
            value={diachi}
            onChange={(e) => setDiachi(e.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label htmlFor="ThuCung" className="form-label">
            Thú cưng
          </label>
          <input
            type="text"
            className="form-control"
            id="ThuCung"
            value={thucung}
            onChange={(e) => setThucung(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="MatKhau" className="form-label">
            Mật khẩu
          </label>
          <input
            type="password"
            className="form-control"
            id="MatKhau"
            value={matkhau}
            onChange={(e) => setMatkhau(e.target.value)}
          />
        </div>
      </div>
    </div>
    <button type="submit" className="btn btn-primary">
      Xác nhận
    </button>
  </form>
</div>

        </div>
      </div>
    </div>
  );
}

export default AdminTaiKhoanThem;
