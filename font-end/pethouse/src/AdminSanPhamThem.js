import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function AdminSanPhamThem() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const [ten_san_pham, setTenSanPham] = useState("");
  const [ma_danh_muc, setMaDanhMuc] = useState("");
  const [gia, setGia] = useState(0);
  const [giam_gia, setGiamGia] = useState(0);
  const [mo_ta, setMoTa] = useState("");
  const [hinh_anh, setHinhAnh] = useState("");
  const [so_luong, setSoLuong] = useState(0);
  const [luot_xem, setLuotXem] = useState(0);
  const [luot_ban, setLuotBan] = useState(0);
  const [trang_thai, setTrangThai] = useState(1); // Trạng thái mặc định là 1
  const [ngay_tao, setNgayTao] = useState(
    new Date().toISOString().split("T")[0]
  ); // Ngày hiện tại
  const [ngay_cap_nhat, setNgayCapNhat] = useState(
    new Date().toISOString().split("T")[0]
  ); // Ngày hiện tại
  const [danhMuc, setDanhMuc] = useState([]);
  const [error, setError] = useState(null);

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    fetch("http://localhost:8000/api/category")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy danh sách danh mục");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setDanhMuc(data.data);
        } else {
          throw new Error(data.message || "Không có dữ liệu danh mục");
        }
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("MaDanhMuc", ma_danh_muc);
    formData.append("TenSanPham", ten_san_pham);
    formData.append("GiaSP", gia);
    formData.append("GiamGia", giam_gia);
    formData.append("MoTa", mo_ta);
    formData.append("HinhAnh", hinh_anh);
    formData.append("SoLuong", so_luong);
    formData.append("LuotXem", luot_xem);
    formData.append("LuotBan", luot_ban);
    formData.append("TrangThai", trang_thai);
    formData.append("NgayTao", ngay_tao);
    formData.append("NgayCapNhat", ngay_cap_nhat);

    // Log để kiểm tra file hình ảnh
    console.log("Hình ảnh:", hinh_anh);

    fetch("http://localhost:8000/api/products/store", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Lỗi khi thêm sản phẩm");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          alert("Thêm sản phẩm thành công!");
          // Reset form
          setTenSanPham("");
          setMaDanhMuc("");
          setGia(0);
          setGiamGia(0);
          setMoTa("");
          setHinhAnh(null);
          setSoLuong(0);
          setLuotXem(0);
          setLuotBan(0);
          setTrangThai(1);
          setNgayTao(new Date().toISOString().split("T")[0]);
          setNgayCapNhat(new Date().toISOString().split("T")[0]);
          navigate("/adminsanpham"); // Chuyển hướng về trang danh sách sản phẩm
        } else {
          throw new Error(data.message || "Có lỗi xảy ra");
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error.message);
        alert(error.message);
      });
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

          <div className="container mt-3 mb-5">
            <div className="d-flex">
              <Link
                to={"/adminsanpham"}
                className="my-0 my-auto btn border border-secondary-subtle text-secondary me-3"
              >
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h1 className="mb-0">Thêm sản phẩm</h1>
              {error && <p className="text-danger">{error}</p>}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-wrap">
                <div className="col-md-8 px-0">
                  <div className="d-flex flex-wrap me-3">
                    <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Thông tin sản phẩm</h5>

                      <div className="mb-3">
                        <label className="form-label">Tên sản phẩm</label>
                        <input
                          type="text"
                          className="form-control"
                          value={ten_san_pham}
                          onChange={(e) => setTenSanPham(e.target.value)}
                          required
                        />
                      </div>

                      <div className="row mb-3">
                        <div className="col-md">
                          <label className="form-label">Mã danh mục</label>
                          <select
                            className="form-select"
                            value={ma_danh_muc}
                            onChange={(e) => setMaDanhMuc(e.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Chọn loại sản phẩm
                            </option>
                            {danhMuc.map((loaiSP) => (
                              <option
                                key={loaiSP.ma_danh_muc}
                                value={loaiSP.ma_danh_muc}
                              >
                                {loaiSP.ten_danh_muc}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md">
                          <label className="form-label">Số lượng</label>
                          <input
                            type="number"
                            className="form-control"
                            value={so_luong}
                            onChange={(e) => setSoLuong(Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md">
                          <label className="form-label">Lượt xem</label>
                          <input
                            type="number"
                            className="form-control"
                            value={luot_xem}
                            onChange={(e) => setLuotXem(Number(e.target.value))}
                            readOnly // Lượt xem mặc định là 0
                          />
                        </div>
                        <div className="col-md">
                          <label className="form-label">Lượt bán</label>
                          <input
                            type="number"
                            className="form-control"
                            value={luot_ban}
                            onChange={(e) => setLuotBan(Number(e.target.value))}
                            readOnly // Lượt bán mặc định là 0
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md">
                          <label id="TrangThai" className="form-label">
                            Trạng thái
                          </label>
                          <select
                            type="number"
                            className="form-select"
                            value={trang_thai}
                            onChange={(e) =>
                              setTrangThai(Number(e.target.value))
                            }
                          >
                            <option value="0">Ẩn</option>
                            <option value="1">Hiện</option>
                          </select>
                        </div>
                        <div className="col-md">
                          <label className="form-label">Ngày tạo</label>
                          <input
                            type="date"
                            className="form-control"
                            value={ngay_tao}
                            onChange={(e) => setNgayTao(e.target.value)}
                            readOnly // Ngày tạo mặc định là ngày hiện tại
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <textarea
                          className="form-control"
                          value={mo_ta}
                          onChange={(e) => setMoTa(e.target.value)}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md px-0">
                  <div className="d-flex flex-wrap">
                    <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Ảnh sản phẩm</h5>

                      <div className="text-center">
                        <div className="d-flex justify-content-center py-2">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setHinhAnh(e.target.files[0])}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Thông tin giá</h5>

                      <div className="mb-3">
                        <label className="form-label">Giá sản phẩm</label>
                        <input
                          type="number"
                          className="form-control"
                          value={gia}
                          onChange={(e) => setGia(Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Giảm giá</label>
                        <input
                          type="number"
                          className="form-control"
                          value={giam_gia}
                          onChange={(e) => setGiamGia(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <Link
                  to={"/adminsanpham"}
                  type="button"
                  className="btn btn-outline-danger me-2"
                >
                  Hủy
                </Link>
                <button type="submit" className="btn btn-primary ms-2 my-auto">
                  Thêm sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSanPhamThem;
