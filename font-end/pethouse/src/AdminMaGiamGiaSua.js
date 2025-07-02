import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ReactPaginate from "react-paginate";
import "./App.css";

function AdminMGGSua() {
  const { maGiamGia } = useParams(); // Lấy mã giảm giá từ URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [MaGiamGia, setMaGiamGia] = useState(""); // Mã giảm giá
  const [LoaiGiam, setLoaiGiam] = useState(""); // Loại giảm giá
  const [Code, setCode] = useState(""); // Mã code
  const [Value, setValue] = useState(0); // Giá trị giảm giá
  const [MinOrderValue, setMinOrderValue] = useState(0); // Giá trị đơn hàng tối thiểu
  const [ExpiryDate, setExpiryDate] = useState(""); // Ngày hết hạn
  const [UsageLimit, setUsageLimit] = useState(0); // Giới hạn sử dụng
  const [error, setError] = useState(null);
  const [existingCodes, setExistingCodes] = useState([]); // Mảng mã giảm giá hiện có

  // Lấy thông tin mã giảm giá hiện tại
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/coupons/${maGiamGia}`) // Gọi API lấy chi tiết mã giảm giá
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể tải thông tin mã giảm giá");
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success" && data.data.length > 0) {
          const coupon = data.data[0]; // Lấy đối tượng đầu tiên trong mảng `data`
          setMaGiamGia(coupon.ma_giam_gia || "");
          setLoaiGiam(coupon.loai_giam || "");
          setCode(coupon.code || "");
          setValue(parseFloat(coupon.phan_tram) || 0); // Chuyển đổi giá trị `phan_tram` thành số
          setMinOrderValue(parseFloat(coupon.so_tien_nho_nhat) || 0); // Chuyển đổi giá trị `so_tien_nho_nhat` thành số
          setExpiryDate(coupon.ngay_het_giam || "");
          setUsageLimit(coupon.so_luong || 0); // Số lượng
        } else {
          setError("Không tìm thấy thông tin mã giảm giá");
        }
      })
      .catch(() => setError("Lỗi khi tải thông tin mã giảm giá"));

    // Lấy danh sách mã giảm giá đã tồn tại
    fetch("http://127.0.0.1:8000/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.data) {
          const codes = data.data.map((coupon) => coupon.code);
          setExistingCodes(codes);
        }
      })
      .catch(() => setError("Lỗi khi tải danh sách mã giảm giá"));
  }, [maGiamGia]);

  // Kiểm tra mã giảm giá có bị trùng lặp không
  const isCodeDuplicate = (code) => {
    return existingCodes.includes(code);
  };

  // Xử lý cập nhật mã giảm giá
  const handleSubmit = (e) => {
    e.preventDefault();



    const formData = {
      code: Code,
      type: LoaiGiam,
      value: Value,
      min_order_value: MinOrderValue,
      expiry_date: ExpiryDate,
      usage_limit: UsageLimit,
    };

    fetch(`http://127.0.0.1:8000/api/coupons/update/${maGiamGia}`, {
      method: "PUT", // Sử dụng phương thức PUT để cập nhật
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Cập nhật thất bại");
        }
        return res.json();
      })
      .then(() => {
        alert("Cập nhật thành công!");
        navigate("/adminmagiamgia");
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật:", err);
        alert(`Có lỗi xảy ra khi cập nhật mã giảm giá: ${err.message}`);
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
              <h1 className="mb-0">Sửa mã giảm giá</h1>
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
                      value={Code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>

                  {/* Loại giảm giá */}
                  <div className="mb-3">
                    <label className="form-label">Loại giảm giá</label>
                    <select
                      className="form-control"
                      value={LoaiGiam}
                      onChange={(e) => setLoaiGiam(e.target.value)}
                      required
                    >
                      <option value="">Chọn loại giảm giá</option>
                      <option value="fixed">Giảm giá cố định</option>
                      <option value="percentage">Giảm giá theo phần trăm</option>
                    </select>
                  </div>

                  {/* Giá trị giảm */}
                  <div className="mb-3">
                    <label className="form-label">
                      {LoaiGiam === "fixed" ? "Giảm giá (VNĐ)" : "Giảm giá (%)"}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={Value}
                      onChange={(e) => {
                        const inputValue = Number(e.target.value);
                        if (LoaiGiam === "percentage" && inputValue > 100) {
                          setValue(100); // Giới hạn tối đa 100% nếu là giảm theo phần trăm
                        } else {
                          setValue(inputValue);
                        }
                      }}
                      required
                      placeholder={
                        LoaiGiam === "fixed" ? "Nhập số tiền giảm (VNĐ)" : "Nhập phần trăm giảm (%)"
                      }
                    />
                  </div>

                </div>

                {/* Cột phải */}
                <div className="col-md-6">

                  <div className="mb-3">
                    <label className="form-label">Giá trị đơn hàng tối thiểu</label>
                    <input
                      type="number"
                      className="form-control"
                      value={MinOrderValue}
                      onChange={(e) => setMinOrderValue(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ngày hết hạn</label>
                    <input
                      type="date"
                      className="form-control"
                      value={ExpiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giới hạn sử dụng</label>
                    <input
                      type="number"
                      className="form-control"
                      value={UsageLimit}
                      onChange={(e) => setUsageLimit(Number(e.target.value))}
                      required
                    />
                  </div>





                </div>

              </div>
              <button type="submit" className="btn btn-primary">
                Cập nhật
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>



  );
}

export default AdminMGGSua;
