import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

function AdminMGGThem() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Trạng thái cho mã giảm giá
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");  // "percentage" or "fixed"
  const [value, setValue] = useState(0);
  const [min_order_value, setMinOrderValue] = useState(0);
  const [expiry_date, setExpiryDate] = useState("");
  const [usage_limit, setUsageLimit] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const couponData = {
      code,
      type,
      value,
      min_order_value,
      expiry_date,
      usage_limit,
    };

    // Gửi yêu cầu thêm mã giảm giá
    fetch("http://localhost:8000/api/coupons/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Thêm mã giảm giá thành công!");
          navigate("/adminmagiamgia"); // Chuyển hướng về trang mã giảm giá
        } else {
          throw new Error(data.message || "Có lỗi xảy ra khi thêm mã giảm giá");
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error.message);
        alert(error.message);
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
            <div className="d-flex align-items-center mb-4">
              <Link
                to={"/adminmagiamgia"}
                className="btn border border-secondary-subtle text-secondary me-3"
              >
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h1 className="mb-0">Thêm mã giảm giá</h1>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Cột trái */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mã giảm giá</label>
                    <input
                      type="text"
                      className="form-control"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Loại giảm giá</label>
                    <select
                      className="form-control"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      <option value="percentage">Giảm theo phần trăm</option>
                      <option value="fixed">Giảm theo tiền</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {type === "fixed" ? "Giảm (VNĐ)" : "Giảm (%)"}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={value}
                      onChange={(e) => {
                        const inputValue = Number(e.target.value);
                        if (type === "percentage" && inputValue > 100) {
                          setValue(100); // Giới hạn tối đa là 100 nếu giảm theo phần trăm
                        } else {
                          setValue(inputValue);
                        }
                      }}
                      required
                      placeholder={type === "fixed" ? "Nhập số tiền giảm (VNĐ)" : "Nhập phần trăm giảm (%)"}
                    />
                  </div>

                </div>

                {/* Cột phải */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mức tiêu thụ để áp dụng</label>
                    <input
                      type="number"
                      className="form-control"
                      value={min_order_value}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Hạn sử dụng</label>
                    <input
                      type="date"
                      className="form-control"
                      value={expiry_date}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giới hạn sử dụng</label>
                    <input
                      type="number"
                      className="form-control"
                      value={usage_limit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-primary">
                  Thêm mã giảm giá
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>



  );
}

export default AdminMGGThem;
