import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import ReactPaginate from "react-paginate";
import "./App.css";

function AdminDanhMuc() {
  const [list_dm, ganDM] = useState([]);
  const { user } = useAuth(); 

  // Lấy danh sách danh mục
  useEffect(() => {
    fetch("http://localhost:8000/api/category")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu trả về:", data); // Kiểm tra dữ liệu
        // Kiểm tra xem data có thuộc tính data không
        if (Array.isArray(data.data)) {
          ganDM(data.data); // Nếu có mảng sản phẩm trong data
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          ganDM([]); // Khởi tạo giá trị mặc định
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
              className="list-group-item list-group-item-action my-0 rounded-0 active"
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
              to={"/admindanhmucthem"}
              className="btn btn-success float-end"
            >
              Thêm danh mục
            </Link>

            <h2 className="my-3">Danh mục</h2>
            <table className="table align-middle table-borderless">
              <thead>
                <tr>
                  <th className="fw-bold text-center">STT</th>
                  <th className="fw-bold">Tên danh mục</th>
                  <th className="fw-bold text-center">Phân loại</th>
                  <th className="fw-bold text-center">Ngày tạo</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <PhanTrang listDM={list_dm} pageSize={10} ganDM={ganDM} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function HienSPTrongMotTrang({ spTrongTrang, fromIndex, ganDM }) {
  const setSelectedCategory = useState(null);

  const fetchCategoryById = (ma_danh_muc) => {
    fetch(`http://localhost:8000/api/category/${ma_danh_muc}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Thông tin danh mục:", data);
        setSelectedCategory(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin danh mục:", error);
      });
  };

  const xoaDanhMuc = (ma_danh_muc) => {
    if (window.confirm("Bạn có muốn xóa danh mục sản phẩm này?")) {
      fetch(`http://localhost:8000/api/category/destroy/${ma_danh_muc}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.status === 204) {
            alert("Danh mục đã được xóa thành công");
            return fetch("http://localhost:8000/api/category");
          } else {
            throw new Error("Lỗi khi xóa danh mục");
          }
        })
        .then((res) => {
          if (res) {
            return res.json();
          }
        })
        .then((data) => {
          if (Array.isArray(data.data)) {
            ganDM(data.data); // Sử dụng ganDM từ props
          } else {
            console.error("Dữ liệu không phải là mảng:", data);
            ganDM([]); // Khởi tạo giá trị mặc định
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xóa danh mục:", error);
          alert("Có lỗi xảy ra: " + error.message);
        });
    }
  };

  return (
    <>
      {spTrongTrang.map((dm, i) => {
        let loaiDanhMuc;
        const parentId = parseInt(dm.parent_id, 10); // Chuyển đổi parent_id từ chuỗi sang số

        // Kiểm tra giá trị parentId để xác định loại danh mục
        switch (parentId) {
          case 0:
            loaiDanhMuc = "Thư mục cha";
            break;
          case 1:
            loaiDanhMuc = "Thư mục cha -> Chó";
            break;
          case 2:
            loaiDanhMuc = "Thư mục cha -> Mèo";
            break;
          default:
            loaiDanhMuc = "Khác"; // Hoặc xử lý cho các trường hợp khác
            break;
        }

        console.log(
          `Danh mục: ${dm.ten_danh_muc}, parent_id: ${parentId}, loại: ${loaiDanhMuc}`
        ); // Kiểm tra thông tin

        return (
          <tr key={dm.ma_danh_muc}>
            <td className="text-center">{fromIndex + i + 1}</td>
            <td>{dm.ten_danh_muc}</td>
            <td className="text-center">{loaiDanhMuc}</td>
            <td className="text-center">{dm.ngay_tao}</td>
            <td className="text-center">
              <Link
                onClick={() => fetchCategoryById(dm.ma_danh_muc)}
                to={`/admindanhmucsua/${dm.ma_danh_muc}`}
                className="btn btn-outline-warning m-1"
              >
                <i className="bi bi-pencil-square"></i>
              </Link>
              <button
                onClick={() => xoaDanhMuc(dm.ma_danh_muc)}
                className="btn btn-outline-danger m-1"
              >
                <i className="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}

function PhanTrang({ listDM, pageSize, ganDM }) {
  const [fromIndex, setfromIndex] = useState(0);
  const toIndex = fromIndex + pageSize;
  const spTrong1Trang = listDM.slice(fromIndex, toIndex);
  const tongSoTrang = Math.ceil(listDM.length / pageSize);

  const chuyenTrang = (event) => {
    const newIndex = (event.selected * pageSize) % listDM.length;
    setfromIndex(newIndex);
  };

  return (
    <>
      <HienSPTrongMotTrang
        spTrongTrang={spTrong1Trang}
        fromIndex={fromIndex}
        ganDM={ganDM}
      />
      <tr>
        <td colSpan="5">
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
}

export default AdminDanhMuc;
