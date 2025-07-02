import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function AdminDonHangSua() {
  const { ma_don_hang } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [pttt, setPttt] = useState("Tiền mặt");
  const [ghiChu, setGhiChu] = useState("");
  const [trangThai, setTrangThai] = useState("cho_xac_nhan");
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Dữ liệu sản phẩm trong đơn hàng
  const [sanPhamDetails, setSanPhamDetails] = useState([]);

  // Tính tổng hóa đơn
  const calculateTotal = () => {
    return sanPhamDetails.reduce((total, detail) => {
      return total + detail.SoLuong * detail.DonGia;
    }, 0);
  };

  // Lấy thông tin chi tiết đơn hàng
  useEffect(() => {
    fetch(`http://localhost:8000/api/orderDetails/${ma_don_hang}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy thông tin đơn hàng");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          const order = data.data[0];
          setOrderDetails(order);
          setHoTen(order.Ten);
          setSoDienThoai(order.SDT);
          setDiaChi(order.DiaChi);
          setPttt(order.PTTT);
          setGhiChu(order.GhiChu || "");
          setTrangThai(order.TrangThai);
          setSanPhamDetails(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }, [ma_don_hang]);

  // Cập nhật thông tin đơn hàng
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOrder = {
      Ten: hoTen,
      SDT: soDienThoai,
      DiaChi: diaChi,
      PTTT: pttt,
      GhiChu: ghiChu, // Đảm bảo ghi chú đã được cập nhật
      TrangThai: trangThai,
      NgayGiao: new Date().toISOString().split("T")[0],
    };

    console.log("Dữ liệu gửi lên:", JSON.stringify(updatedOrder, null, 2)); // Kiểm tra dữ liệu gửi lên

    fetch(`http://localhost:8000/api/orders/${ma_don_hang}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(
              `Cập nhật thất bại: ${errorData.message || res.statusText}`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          alert("Cập nhật thành công!");
          // Cập nhật ghi chú nếu cần
          setGhiChu(data.updatedOrder.GhiChu || ghiChu);
          navigate("/adminsanpham"); // Chuyển hướng về trang danh sách sản phẩm
        } else {
          alert("Cập nhật thất bại: " + (data.message || "Không rõ lý do"));
        }
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  const handlePrintOrder = async () => {
    const currentDate = new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/orderDetailServices/${ma_don_hang}`);
        if (!response.ok) {
            throw new Error(`Lỗi khi gọi API chi tiết đơn hàng: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.status !== 'success' || !Array.isArray(result.data) || result.data.length === 0) {
            alert("Không có chi tiết đơn hàng. Vui lòng kiểm tra lại.");
            return;
        }

        const chiTietDonHang = result.data.map((ct, index) => {
            const totalProductPrice = ct.DonGia * ct.SoLuong;
            return `
          <tr>
            <td style="text-align: center; padding: 10px; border-top: 1px solid #ddd;">${index + 1}</td>
            <td style="text-align: center; padding: 10px; border-top: 1px solid #ddd;">${ct.SanPham.TenSP}</td>
            <td style="text-align: center; padding: 10px; border-top: 1px solid #ddd;">${ct.SoLuong}</td>
            <td style="text-align: center; padding: 10px; border-top: 1px solid #ddd;">${new Intl.NumberFormat("vi-VN").format(ct.DonGia)}</td>
            <td style="text-align: center; padding: 10px; border-top: 1px solid #ddd;">${new Intl.NumberFormat("vi-VN").format(totalProductPrice)}</td>
          </tr>
        `;
        }).join("");

        const totalBeforeDiscount = result.data.reduce((total, ct) => total + ct.DonGia * ct.SoLuong, 0);
        const discount = 0; // Cập nhật giá trị giảm giá nếu có
        const totalAfterDiscount = totalBeforeDiscount - discount;

        const printContent = `
        <html>
          <head>
            <title>Hóa đơn ${ma_don_hang}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
          </head>
          <body>
            <div style="margin-top: 50px; border: 1px solid #ddd; padding: 20px; font-family: Arial, sans-serif;">
              <div class="header" style="text-align: center; margin-bottom: 20px;">
                <img id="logo" src="http://localhost:3000/image/logo-ngang.png" alt="Logo" style="width: 120px;">
                <h2 style="margin: 0;">CỬA HÀNG PETHOUSE VIỆT NAM</h2>
                <p style="margin: 5px 0;">Tô ký, phường Trung Mỹ Tây, quận 12, TP.HCM</p>
                <p style="margin: 5px 0;">Email: pethouse@gmail.com / Hotline: 038 997 8430</p>
                <h3 style="margin: 10px 0;">ĐƠN HÀNG</h3>
              </div>
              <p><strong>Ngày:</strong> ${currentDate}</p>
              <p><strong>Tên khách hàng:</strong> ${hoTen}</p>
              <p><strong>Địa chỉ:</strong> ${diaChi}</p>
              <p><strong>Số điện thoại:</strong> ${soDienThoai}</p>
              <p><strong>Mã đơn hàng:</strong> ${ma_don_hang}</p>
              <h3 style="margin-top: 20px;">Chi tiết đơn hàng:</h3>  
              <table style="border: 1px solid #ddd; border-collapse: collapse; width: 100%;">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>${chiTietDonHang}</tbody>
              </table>
              <div class="total" style="margin-top: 20px; font-weight: bold;">
                <p><span>Tổng trước giảm giá:</span><span class="right" style="float: right;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(totalBeforeDiscount)}</span></p>
                <p><span>Giảm giá:</span><span class="right" style="float: right;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(discount)}</span></p>
                <p><span class="font-weight-bold">Tổng thanh toán:</span><span class="right" style="float: right; color: red;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(totalAfterDiscount)}</span></p>
              </div>
            </div>
            <script>
              window.onload = function() {
                const logo = document.getElementById("logo");
                if (logo.complete) {
                  window.print();
                  window.close();
                } else {
                  logo.onload = function() {
                    window.print();
                    window.close();
                  };
                }
              };
            </script>
          </body>
        </html>
      `;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
        }
    } catch (error) {
        console.error("Lỗi khi in đơn hàng:", error);
        alert("Đã xảy ra lỗi khi in đơn hàng.");
    }
};

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }


  // Xóa dấu
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const menuItems = [
    "Tổng quan",
    "Sản phẩm",
    "Dịch vụ chăm sóc",
    "Danh mục",
    "Tài khoản",
    "Đơn hàng",
    "Đặt lịch",
    "Tin tức",
    "Liên hệ",
    "Mã giảm giá",
  ];

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
              alt="Logo"
            />
          </Link>
          <div className="list-group list-group-item-primary mt-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={`/admin${removeDiacritics(item)
                  .replace(/\s+/g, "")
                  .toLowerCase()}`}
                className={`list-group-item list-group-item-action my-0 rounded-0 ${item === "Đơn hàng" ? "active" : ""
                  }`}
              >
                <h5 className="mb-0 py-1">{item}</h5>
              </Link>
            ))}
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
                      <li>
                        <Link
                          className="menu-header-top dropdown-item"
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
                          className="menu-header-bottom dropdown-item"
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
            <div className="d-flex justify-content-between align-items-center">


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
                  <h1 className="mb-0">Cập nhật đơn hàng #{ma_don_hang}</h1>
                </div>




              </div>
              <div className="d-flex align-center">
                <div className="col-md-auto px-3 text-primary">
                  <strong onClick={handlePrintOrder}>
                    <i className="bi bi-printer"></i> In đơn
                  </strong>
                </div>
              </div>


            </div>

            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-wrap">
                <div className="col-md-8 px-0">
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
                          />
                        </div>
                        <div className="col-md">
                          <label className="form-label">Số điện thoại</label>
                          <input
                            type="text"
                            className="form-control"
                            value={soDienThoai}
                            onChange={(e) => setSoDienThoai(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input
                          type="text"
                          className="form-control"
                          value={diaChi}
                          onChange={(e) => setDiaChi(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md px-0">
                  <div className="d-flex flex-wrap">
                    <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Trạng thái đơn hàng</h5>
                      <select
                        className="form-select"
                        value={trangThai}
                        onChange={(e) => setTrangThai(e.target.value)}
                      >
                        <option value="cho_xac_nhan">Chờ xác nhận</option>
                        <option value="da_xac_nhan">Đã xác nhận</option>
                        <option value="dang_van_chuyen">Đang vận chuyển</option>
                        <option value="da_thanh_toan">Đã thanh toán</option>
                        <option value="hoan_thanh">Hoàn thành</option>
                        <option value="huy">Hủy</option>
                      </select>
                    </div>

                    <div className="col-md border border-dark rounded-3 my-3 p-2">
                      <h5 className="mb-2 py-1">Phương thức thanh toán</h5>
                      <select
                        className="form-select"
                        value={pttt}
                        onChange={(e) => setPttt(e.target.value)}
                      >
                        <option value="Tiền mặt">Tiền mặt</option>
                        <option value="Chuyển khoản">Chuyển khoản</option>
                        <option value="MOMO">Thanh toán MOMO</option>
                        <option value="VNPAY">Thanh toán VNPAY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap">
                <div className="col-md-12 border border-dark rounded-3 my-3 p-2">
                  <h5 className="mb-2 py-1">Chi tiết đơn hàng</h5>
                  {/* <form className="d-flex mb-3" role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Nhập tên sản phẩm"
                      aria-label="Search"
                    />
                  </form> */}

                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th className="text-center fw-bold">STT</th>
                        <th colSpan={2} className="fw-bold w-50">
                          Sản phẩm
                        </th>
                        <th className="text-center fw-bold">Số lượng</th>
                        <th className="text-end fw-bold">Đơn giá</th>
                        <th className="text-end fw-bold text-nowrap">
                          Thành tiền
                        </th>
                        <th className="text-center fw-bold text-nowrap"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sanPhamDetails.map((detail, index) => (
                        <tr key={detail.MaCTDH}>
                          <td className="text-center">{index + 1}</td>
                          <td style={{ width: "8%" }}>
                            <img
                              src={`../image/product/${detail.SanPham.HinhAnh}`}
                              alt={detail.SanPham.TenSP}
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
                          <td className="text-center">
                            <i className="bi bi-x-lg btn text-danger p-0"></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="text-center">Ghi chú</td>
                        <td colSpan={3}>
                          <textarea
                            className="form-control h-50"
                            value={ghiChu}
                            onChange={(e) => setGhiChu(e.target.value)}
                          ></textarea>
                        </td>
                        <td className="text-end fw-bold">Tổng hóa đơn</td>
                        <td className="text-end fw-bold">
                          {parseInt(calculateTotal()).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <Link
                  to={`/admindonhangchitiet/${ma_don_hang}`}
                  className="btn btn-outline-danger me-2 my-0"
                >
                  Hủy
                </Link>
                <button type="submit" className="btn btn-primary ms-2">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDonHangSua;
