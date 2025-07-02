import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

function AdminSanPham() {
  const { user } = useAuth();
  const [list_sp, ganSP] = useState([]);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu trả về:", data); // Kiểm tra dữ liệu
        // Kiểm tra xem data có thuộc tính data không
        if (Array.isArray(data.data)) {
          ganSP(data.data); // Nếu có mảng sản phẩm trong data
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          ganSP([]); // Khởi tạo giá trị mặc định
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });
  }, []);

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
              className="list-group-item list-group-item-action my-0  rounded-0 active"
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
              to={"/adminsanphamthem"}
              className="btn btn-success float-end"
            >
              Thêm sản phẩm
            </Link>

            <h2 className="my-3">Sản phẩm</h2>
            <table className="table align-middle table-borderless">
              <thead>
                <tr>
                  <th className="fw-bold text-center">STT</th>
                  <th className="fw-bold text-center">Ảnh</th>
                  <th className="fw-bold">Tên sản phẩm</th>
                  <th className="fw-bold text-center">Danh mục</th>
                  <th className="fw-bold text-center">Ngày tạo</th>
                  <th className="fw-bold text-center text-nowrap">
                    Trạng thái
                  </th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <PhanTrang listSP={list_sp} pageSize={10} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function HienSPTrongMotTrang({ spTrongTrang, fromIndex }) {
  const [ganSP] = useState([]);
  const setSelectedProduct = useState(null);

  const fetchProductById = (ma_san_pham) => {
    fetch(`http://localhost:8000/api/products/${ma_san_pham}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Thông tin sản phẩm:", data);
        setSelectedProduct(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      });
  };

  const xoaSanPham = (maSP) => {
    // Hiển thị thông báo xác nhận
    if (window.confirm("Bạn có muốn xóa sản phẩm này?")) {
      fetch(`http://localhost:8000/api/products/destroy/${maSP}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            // Loại bỏ sản phẩm khỏi danh sách trong trạng thái list_sp
            ganSP((prevSP) => prevSP.filter((sp) => sp.ma_san_pham !== maSP)); 
            // Thêm một khoảng thời gian nhỏ để chắc chắn UI được render lại
            setTimeout(() => {
              console.log('Sản phẩm đã được xóa khỏi danh sách');
            }, 100); // Thời gian có thể điều chỉnh
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
        });
    }
  };
  
  

  return (
    <>
      {
        spTrongTrang.map((sp, i) => {
          return (
            <tr>
              <td className="text-center">{fromIndex + i + 1}</td>
              <td className="text-center">
                <img
                  src={`http://localhost:8000/image/product/${sp.hinh_anh}`}
                  alt={`image/product/${sp.hinh_anh}`}
                  style={{ width: "100px" }}
                />
              </td>
              <td>{sp.ten_san_pham}</td>
              <td className="text-center">{sp.tenDM}</td>
              <td className="text-center">{sp.ngay_tao}</td>
              <td className="text-center">
                {Number(sp.trang_thai) === 1 ? "Hiện" : "Ẩn"}
              </td>

              <td className="text-center" style={{ width: "150px" }}>
                <Link
                  onClick={() => fetchProductById(sp.ma_san_pham)}
                  to={`/adminsanphamsua/${sp.ma_san_pham}`}
                  className="btn btn-outline-warning m-1"
                >
                  <i className="bi bi-pencil-square"></i>
                </Link>
                <button
                  onClick={() => xoaSanPham(sp.ma_san_pham)}
                  className="btn btn-outline-danger m-1"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          );
        }) //map
      }
    </>
  );
} //HienSPTrongMotTrang

function PhanTrang({ listSP, pageSize }) {
  const [fromIndex, setfromIndex] = useState(0);
  const toIndex = fromIndex + pageSize;
  const spTrong1Trang = listSP.slice(fromIndex, toIndex);
  const tongSoTrang = Math.ceil(listSP.length / pageSize);
  const chuyenTrang = (event) => {
    const newIndex = (event.selected * pageSize) % listSP.length;
    setfromIndex(newIndex);
  };
  return (
    <>
      <HienSPTrongMotTrang spTrongTrang={spTrong1Trang} fromIndex={fromIndex} />
      <tr>
        <td colspan="7">
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

export default AdminSanPham;
