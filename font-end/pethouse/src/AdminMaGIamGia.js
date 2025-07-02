import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import "./App.css";

function AdminMaGiamGia() {
  const { user, isLoggedIn } = useAuth(); // Lấy trạng thái đăng nhập
  const [listDiscounts, setListDiscounts] = useState([]); // Danh sách mã giảm giá

  // Lấy danh sách mã giảm giá
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/coupons");
        const data = await response.json();
        setListDiscounts(data.data || []); // Gán dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mã giảm giá:", error);
      }
    };

    fetchDiscounts();
  }, []);

  // Hàm xóa mã giảm giá
  const handleDelete = async (ma_giam_gia) => {
    if (window.confirm("Bạn chắc chắn muốn xóa mã giảm giá này?")) {
      try {
        // Gọi API xóa mã giảm giá với ma_giam_gia
        const response = await fetch(`http://127.0.0.1:8000/api/coupons/destroy/${ma_giam_gia}`, {
          method: "DELETE", // Phương thức DELETE để xóa mã giảm giá
        });

        if (response.ok) {
          // Cập nhật lại danh sách mã giảm giá sau khi xóa
          setListDiscounts(listDiscounts.filter((discount) => discount.ma_giam_gia !== ma_giam_gia));
          alert("Mã giảm giá đã được xóa.");
        } else {
          alert("Xóa mã giảm giá thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa mã giảm giá:", error);
        alert("Có lỗi xảy ra khi xóa mã giảm giá.");
      }
    }
  };

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" />;
  }

  return (
<div className="container-fluid">
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
              alt={`http://localhost:8000/image/Nen_trong_suot.png`}
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
              className="list-group-item list-group-item-action my-0 rounded-0"
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
              className="list-group-item list-group-item-action my-0 rounded-0 active"
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
            
          <Link to={"/adminmggThem"} className="btn btn-success float-end">Thêm mã giảm giá</Link>
            <h2 className="my-3">Danh sách mã giảm giá</h2>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="fw-bold text-center">STT</th>
                  <th className="fw-bold">Mã giảm giá</th>
                  <th className="fw-bold">Loại</th>
                  <th className="fw-bold text-center">Code</th>
                  <th className="fw-bold text-center">Giảm</th>
                  <th className="fw-bold text-center">Mức tiêu thụ để áp dụng</th>
                  <th className="fw-bold text-center">Số lượng</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listDiscounts.map((discount, i) => (
                  <tr key={discount.ma_giam_gia}>
                    <td className="text-center">{i + 1}</td>
                    <td>{discount.ma_giam_gia}</td>
                    <td>{discount.loai_giam}</td>
                    <td className="text-center">{discount.code}</td>
                    <td className="text-center">
                      {discount.loai_giam === "fixed"
                        ? `${parseInt(discount.phan_tram).toLocaleString("vi-VN")} VNĐ`
                        : `${parseFloat(discount.phan_tram)}%`}
                    </td>
                    <td className="text-center">{parseInt(discount.so_tien_nho_nhat).toLocaleString("vi-VN")} VNĐ</td>
                    <td className="text-center">{discount.so_luong}</td>
                    <td className="text-center">
                      <Link to={`/adminmgmsua/${discount.ma_giam_gia}`} className="btn btn-outline-warning m-1">
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(discount.ma_giam_gia)}
                        className="btn btn-outline-danger m-1"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>





  );
}

export default AdminMaGiamGia;
