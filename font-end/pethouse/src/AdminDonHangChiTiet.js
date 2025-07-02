import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
// Định dạng ngày giờ
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";
// In hóa đơn
// import Invoice from "./Invoice";
// import { PDFDownloadLink } from "@react-pdf/renderer";

function AdminDonHangChiTiet() {
  const { ma_don_hang } = useParams();
  const [ngayDat, setNgayDat] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [PTTT, setPTTT] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [sanPhamDetails, setSanPhamDetails] = useState([]);

  const calculateTotal = () => {
    return sanPhamDetails.reduce((total, detail) => {
      return total + detail.SoLuong * detail.DonGia;
    }, 0); // Bắt đầu với tổng bằng 0
  };

  const { user, isLoggedIn } = useAuth(); // Lấy trạng thái đăng nhập
  // const [order, setOrder] = useState(null); // State để lưu thông tin đơn hàng

  // Lấy thông tin đơn hàng theo mã đơn hàng
  useEffect(() => {
    fetch(`http://localhost:8000/api/orderDetails/${ma_don_hang}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể lấy thông tin đơn hàng");
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          const dh = data.data[0]; // Lấy thông tin đơn hàng đầu tiên
          setNgayDat(dh.NgayDat);
          setHoTen(dh.Ten);
          setSoDienThoai(dh.SDT);
          setDiaChi(dh.DiaChi);
          setTrangThai(dh.TrangThai);
          setPTTT(dh.PTTT);
          setGhiChu(dh.GhiChu);
          setSanPhamDetails(data.data); // Lưu tất cả chi tiết sản phẩm
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [ma_don_hang]);

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
              className="list-group-item list-group-item-action my-0 rounded-0 active"
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

          <div className="container mt-3 mb-5">
            <div className="d-flex align-items-center">
              <div className="col-md-auto">
                <Link
                  to={"/admindonhang"}
                  className="my-0 my-auto btn border border-secondary-subtle text-secondary me-3"
                >
                  <i className="bi bi-arrow-left"></i>
                </Link>
              </div>
              <div className="col-md-auto">
                <h1 className="mb-0">#{ma_don_hang}</h1>
              </div>
              
              <div className="col-md-auto ms-auto px-3">
                <Link
                  className="text-success"
                  to={`/admindonhangsua/${ma_don_hang}`}
                >
                  <strong>
                    <i className="bi bi-pencil-square"></i> Sửa đơn
                  </strong>
                </Link>
              </div>
              <div className="col-md-auto px-3 text-primary">
                <strong>
                  <i className="bi bi-printer"></i> In đơn
                </strong>
              </div>
              
            </div>
            <p className="col-md-12 m-0">{ngayDat}</p>

            <form>
              <div className="d-flex flex-wrap">
                <div className="col-md-12 px-0">
                  <div className="d-flex flex-wrap me-3">
                    <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Thông tin giao hàng</h5>

                      <div className="row mb-3">
                        <div className="col-md">
                          <label className="form-label">Họ và tên</label>
                          <input
                            type="text"
                            className="form-control"
                            value={hoTen}
                            onChange={(e) => setHoTen(e.target.value)}
                            required
                            readOnly
                          />
                        </div>

                        <div className="col-md">
                          <label className="form-label">Số điện thoại</label>
                          <input
                            type="number"
                            className="form-control"
                            value={soDienThoai}
                            onChange={(e) => setSoDienThoai(e.target.value)}
                            required
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input
                          className="form-control"
                          value={diaChi}
                          onChange={(e) => setDiaChi(e.target.value)}
                          required
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md px-0">
                  <div className="d-flex flex-wrap">
                    

                    
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap">
                <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                  <h5 className="mb-2 py-1">Chi tiết đơn hàng</h5>

                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th className="text-center fw-bold">STT</th>
                        <th colSpan={2} className="fw-bold w-50">
                          Sản phẩm
                        </th>
                        <th className="text-center fw-bold">Số lượng</th>
                        <th className="text-end fw-bold">Đơn giá</th>
                        <th className="text-end fw-bold">Thành tiền</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sanPhamDetails.map((detail, index) => (
                        <tr key={detail.MaCTDH}>
                          <td className="text-center">{index + 1}</td>
                          <td style={{ width: "6%" }}>
                            <img
                              src={`../image/product/${detail.SanPham.HinhAnh}`}
                              alt={detail.SanPham.TenSP}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{detail.SanPham.TenSP}</td>
                          <td className="text-center">{detail.SoLuong}</td>
                          <td className="text-end">
                            {parseInt(detail.DonGia).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                          <td className="text-end">
                            {parseInt(
                              detail.SoLuong * detail.DonGia
                            ).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td className="text-center">Ghi chú</td>
                        <td colSpan={3}>
                          <div className="">
                            <textarea
                              className="form-control h-50"
                              value={ghiChu}
                              onChange={(e) => setGhiChu(e.target.value)}
                              readOnly
                            ></textarea>
                          </div>
                        </td>
                        <td className="text-end fw-bold">Tổng hóa đơn</td>
                        <td className="text-end fw-bold">
                          {parseInt(calculateTotal()).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDonHangChiTiet;
