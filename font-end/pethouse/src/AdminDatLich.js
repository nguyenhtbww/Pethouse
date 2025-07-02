import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
// Định dạng ngày giờ
import { format } from "date-fns";
import { vi } from "date-fns/locale";

function AdminDatLich() {
  const [list_dhdv, ganDHDV] = useState([]);

  const { isLoggedIn } = useAuth(); // Lấy trạng thái đăng nhập
  const { user } = useAuth();
  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetch("http://localhost:8000/api/orderServices")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu trả về:", data); // Kiểm tra dữ liệu
        // Kiểm tra xem data có thuộc tính data không
        if (Array.isArray(data.data)) {
          ganDHDV(data.data); // Nếu có mảng sản phẩm trong data
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          ganDHDV([]); // Khởi tạo giá trị mặc định
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });
  }, []);

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
              className="list-group-item list-group-item-action my-0 rounded-0 active"
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
          <Link
              to={"/adminthemdatlich"}
              className="btn btn-success float-end"
            >
              Thêm đơn đặt lịch
            </Link>
            <h2 className="my-3">Dịch vụ</h2>
            <table className="table align-middle table-borderless">
              <thead>
                <tr>
                  <th className="fw-bold text-center">STT</th>
                  <th className="fw-bold">Mã đơn hàng</th>
                  <th className="fw-bold">Ngày sử dụng</th>
                  <th className="fw-bold">Tên khách hàng</th>
                  <th className="fw-bold">Số điện thoại</th>
                  <th className="fw-bold text-end">Khách phải trả</th>
                  <th className="fw-bold text-center text-nowrap">
                    Trạng thái
                  </th>
                  <th className="fw-bold text-center text-nowrap">
                    Phương thức thanh toán
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                <PhanTrang listDHDV={list_dhdv} pageSize={10} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function HienSPTrongMotTrang({ spTrongTrang, fromIndex }) {
  const setSelectedOrderServices = useState(null);

  const fetchOrderById = (ma_tai_khoan) => {
    fetch(`http://localhost:8000/api/orderServices/${ma_tai_khoan}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Thông tin đơn hàng dịch vụ:", data);
        setSelectedOrderServices(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng dịch vụ:", error);
      });
  };

  return (
    <>
      {
        spTrongTrang.map((dhdv, i) => {
          let TrangThaiDonHang;

          if (dhdv.trang_thai === "cho_xac_nhan") {
            TrangThaiDonHang = (
              <span class="badge text-bg-secondary">Chờ xác nhận</span>
            );
          } else if (dhdv.trang_thai === "da_xac_nhan") {
            TrangThaiDonHang = (
              <span class="badge text-bg-info">Đã xác nhận</span>
            );
          } else if (dhdv.trang_thai === "dang_van_chuyen") {
            TrangThaiDonHang = (
              <span class="badge text-bg-warning">Đang vận chuyển</span>
            );
          } else if (dhdv.trang_thai === "hoan_thanh") {
            TrangThaiDonHang = (
              <span class="badge text-bg-success">Hoàn thành</span>
            );
          } else {
            TrangThaiDonHang = <span class="badge text-bg-danger">Đã hủy</span>;
          }

          let PhuongThucThanhToan;
          if (dhdv.phuong_thuc_tt === "cash") {
            PhuongThucThanhToan = "Thanh toán khi nhận hàng";
          } else PhuongThucThanhToan = "Thanh toán chuyển khoản";

          return (
            <tr>
              <td className="text-center align-middle">{fromIndex + i + 1}</td>
              <td className="align-middle">
                <Link
                  onClick={() => fetchOrderById(dhdv.ma_don_hang)}
                  to={`/admindatlichsua/${dhdv.ma_don_hang}`}
                  className="text-primary"
                >
                  #{dhdv.ma_don_hang}
                </Link>
              </td>
              <td className="align-middle">
                {format(new Date(dhdv.ngay_su_dung), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </td>
              <td className="align-middle">{dhdv.ho_ten}</td>
              <td className="align-middle">{dhdv.so_dien_thoai}</td>
              <td className="text-end align-middle">
                {parseInt(dhdv.tong_tien).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td className="text-center align-items-center align-middle">
                {TrangThaiDonHang}
              </td>
              <td className="text-center text-nowrap align-middle">
                {PhuongThucThanhToan}
              </td>
              
            </tr>
          );
        }) //map
      }
    </>
  );
} //HienDHTrongMotTrang

function PhanTrang({ listDHDV, pageSize }) {
  const [fromIndex, setfromIndex] = useState(0);
  const toIndex = fromIndex + pageSize;
  const dhTrong1Trang = listDHDV.slice(fromIndex, toIndex);
  const tongSoTrang = Math.ceil(listDHDV.length / pageSize);
  const chuyenTrang = (event) => {
    const newIndex = (event.selected * pageSize) % listDHDV.length;
    setfromIndex(newIndex);
  };
  return (
    <>
      <HienSPTrongMotTrang spTrongTrang={dhTrong1Trang} fromIndex={fromIndex} />
      <tr>
        <td colspan="8">
          <ReactPaginate
            nextLabel=">"
            previousLabel="<"
            pageCount={tongSoTrang}
            pageRangeDisplayed={5}
            onPageChange={chuyenTrang}
            className="thanhphantrang"
          />
        </td>
      </tr>
    </>
  );
} //PhanTrang

export default AdminDatLich;
