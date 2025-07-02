import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function Admin_Thembv() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tieu_de, setTieuDe] = useState("");
  const [ma_danh_muc_bv, setMaDanhMucBV] = useState("");
  const [noi_dung, setNoiDung] = useState("");
  const [chi_tiet, setChiTiet] = useState("");
  const [hinh, setHinh] = useState(null);
  const [trang_thai, setTrangThai] = useState(1);
  const [ngay_tao] = useState(new Date().toISOString().split("T")[0]);
  const [danhMucBV, setDanhMucBV] = useState([]);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/catagorysNews")
      .then((res) => res.json())
      .then((data) => setDanhMucBV(data.data))
      .catch(() => setError("Không thể lấy danh mục bài viết"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập trước khi thêm bài viết!");
      navigate("/login");
      return;
    }
    if (!hinh) {
      alert("Vui lòng nhập ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("Mataikhoan", user.Mataikhoan);
    formData.append("MaDMBV", ma_danh_muc_bv);
    formData.append("TieuDe", tieu_de);
    formData.append("NoiDung", noi_dung);
    formData.append("ChiTiet", chi_tiet);
    formData.append("Hinh", hinh);
    formData.append("trang_thai", trang_thai);
    formData.append("ngay_tao", ngay_tao);

    fetch("http://127.0.0.1:8000/api/News/store", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            console.error("Lỗi từ server:", err);
            throw new Error(err.message || "Lỗi khi thêm bài viết");
          });
        }
        return res.json();
      })
      .then((data) => {
        alert("Thêm bài viết thành công!");
        setImagePreview(`http://localhost:8000/${data.Hinh}`);
        navigate("/Admin_BV");
      })
      .catch((error) => {
        console.error("Lỗi:", error.message);
        alert("Có lỗi xảy ra: " + (error.message || "Vui lòng kiểm tra lại"));
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
              className="list-group-item list-group-item-action my-0 rounded-0"
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
              className="list-group-item list-group-item-action my-0 rounded-0 active"
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
                to={"/Admin_BV"}
                className="my-0 my-auto btn border border-secondary-subtle text-secondary me-3"
              >
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h1 className="mb-0">Thêm Tin Tức</h1>
              {error && <p className="text-danger">{error}</p>}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-wrap">
                <div className="col-md-8 px-0">
                  <div className="d-flex flex-wrap me-3">
                    <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Thông tin tin tức</h5>
                      <div className="mb-3">
                        <label className="form-label">Tên Tin Tức</label>
                        <input
                          type="text"
                          className="form-control"
                          value={tieu_de}
                          onChange={(e) => setTieuDe(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Nội dung</label>
                        <textarea
                          className="form-control"
                          value={noi_dung}
                          onChange={(e) => setNoiDung(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Chi tiết</label>
                        <textarea
                          className="form-control"
                          value={chi_tiet}
                          onChange={(e) => setChiTiet(e.target.value)}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md px-0">
                  <div className="d-flex flex-wrap">
                    <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Ảnh tin tức</h5>

                      <div className="text-center">
                        <div className="d-flex justify-content-center py-2">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => {
                              setHinh(e.target.files[0]);
                              setImagePreview(
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                            required
                          />
                        </div>
                        {imagePreview && (
                          <div className="mt-3">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "250px",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Thông tin</h5>

                      <div className="mb-3">
                        <label className="form-label">Danh mục</label>
                        <select
                          className="form-select"
                          value={ma_danh_muc_bv}
                          onChange={(e) => setMaDanhMucBV(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Chọn danh mục
                          </option>
                          {danhMucBV.map((dm) => (
                            <option
                              key={dm.ma_danh_muc_BV}
                              value={dm.ma_danh_muc_BV}
                            >
                              {dm.ten_danh_muc_BV}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-outline-success ">
                    Thêm bài viết
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_Thembv;
