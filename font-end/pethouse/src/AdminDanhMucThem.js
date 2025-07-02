
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function AdminDanhMucThem() {
  const { user } = useAuth(); 
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [tenDM, setTenDM] = useState(""); // Trạng thái cho Tên Danh Mục
  const [parentId, setParentId] = useState(null); // Trạng thái cho parent_id
  const [loai, setLoai] = useState("0"); // Trạng thái cho loại
  const [error, setError] = useState(null); // Trạng thái cho lỗi

  // Xử lý gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCategory = {
      TenDM: tenDM,
      parent_id: parentId,
      loai: loai,
    };

    fetch(`http://localhost:8000/api/category/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi thêm danh mục");
        }
        return res.json();
      })
      .then(() => {
        alert("Thêm danh mục thành công!");
        navigate("/admindanhmuc"); // Chuyển hướng về trang danh sách danh mục
      })
      .catch((error) => {
        setError(error.message);
      });
  };

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

          <div className="container mt-3 mb-5">
            <div className="d-flex">
              <Link
                to={"/admindanhmuc"}
                className="my-0 my-auto btn border border-secondary-subtle text-secondary me-3"
              >
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h1 className="mb-0">Thêm danh mục</h1>
            </div>

            <div className="d-flex flex-wrap">
              <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                <h5 className="mb-2 py-1">Thông tin danh mục</h5>

                {error && <p className="text-danger">{error}</p>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="tenDM" className="form-label">
                      Tên Danh Mục
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tenDM"
                      value={tenDM} // Giá trị hiển thị trong ô input
                      onChange={(e) => setTenDM(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="parent_id" className="form-label">
                      Phân Loại
                    </label>
                    <select
                      id="parent_id"
                      className="form-select"
                      value={parentId || ""}
                      onChange={(e) =>
                        setParentId(
                          e.target.value === "" ? null : e.target.value
                        )
                      }
                    >
                      <option value="">Không có</option>
                      <option value="0">Thư Mục Cha</option>
                      <option value="1">Thư Mục Cha - Chó</option>
                      <option value="2">Thư Mục Cha - Mèo</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loai" className="form-label">
                      Loại
                    </label>
                    <select
                      id="loai"
                      className="form-select"
                      value={loai}
                      onChange={(e) => setLoai(e.target.value)}
                    >
                      <option value="0">Loại 0</option>
                      <option value="1">Loại 1</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Thêm
                  </button>
                  <Link to="/admindanhmuc" className="btn btn-secondary ms-2">
                    Trở Về
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDanhMucThem;

