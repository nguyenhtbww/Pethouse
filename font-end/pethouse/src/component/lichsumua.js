import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng để điều hướng
import { useAuth } from "../contexts/AuthContext"; // Lấy thông tin người dùng từ AuthContext

const LichSuMua = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra và tải dữ liệu đơn hàng từ LocalStorage hoặc API
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
      setLoading(false);
    } else {
      fetchOrders();
    }
  }, [user]);

  // Hàm lấy dữ liệu đơn hàng từ API
  const fetchOrders = async () => {
    if (!user || !user.Mataikhoan) {
      setError("Không tìm thấy thông tin tài khoản.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${user.Mataikhoan}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải đơn hàng. Vui lòng thử lại.");
      }

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setOrders(data.data); // Chỉ lưu vào state mà không lưu vào localStorage
        console.log("Dữ liệu đơn hàng đã được tải từ API:", data.data); // Kiểm tra dữ liệu tải về từ API
      } else {
        setOrders([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/donhang/trangthai/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TrangThai: "huy", // Chỉ gửi trạng thái "huy"
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Đơn hàng đã được hủy thành công!");
        fetchOrders(); // Tải lại đơn hàng sau khi hủy
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi hủy đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert(`Lỗi khi hủy đơn hàng: ${error.message}`);
    }
  };

  // Hàm in đơn hàng
  const handlePrintOrder = async (order) => {
    const currentDate = new Date().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orderDetails/${order.ma_don_hang}`);
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

      let totalBeforeDiscount = result.data.reduce((total, ct) => total + ct.DonGia * ct.SoLuong, 0);
      const discount = order.discount || 0;
      const totalAfterDiscount = totalBeforeDiscount - discount;

      const printContent = `
        <html>
          <head>
            <title>Hóa đơn ${order.ma_don_hang}</title>
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
              <p><strong>Tên khách hàng:</strong> ${order.ho_ten}</p>
              <p><strong>Địa chỉ:</strong> ${order.dia_chi}</p>
              <p><strong>Số điện thoại:</strong> ${order.so_dien_thoai}</p>
              <p><strong>Mã đơn hàng:</strong> ${order.ma_don_hang}</p>
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
                <p><span>Giảm giá:</span><span class="right" style="float: right;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(order.giam_gia)}</span></p>
                <p><span class="font-weight-bold">Tổng thanh toán:</span><span class="right" style="float: right; color: red;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(order.tong_tien)}</span></p>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-3">
      <h2>Lịch sử mua hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="text-center align-middle">STT</th>
              <th className="text-center align-middle">Số Lượng</th>
              <th className="text-center align-middle">Trạng Thái</th>
              <th className="text-center align-middle">PTTT</th>
              <th className="text-center align-middle">Ngày Đặt</th>
              <th className="text-center align-middle">Tổng Tiền</th>
              <th className="text-center align-middle">Xem Chi Tiết</th>
              <th className="text-center align-middle">In Đơn Hàng</th>
              <th className="text-center align-middle">Hủy Đơn Hàng</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const orderStatus =
                order.trang_thai === "da_thanh_toan"
                  ? "Đã thanh toán"
                  : order.trang_thai === "cho_xac_nhan"
                    ? "Chờ xác nhận"
                    : order.trang_thai === "da_xac_nhan"
                      ? "Đã xác nhận"
                      : order.trang_thai === "hoan_thanh"
                        ? "Hoàn thành"
                        : order.trang_thai === "dang_van_chuyen"
                          ? "Đang vận chuyển"
                          : order.trang_thai === "huy"
                            ? "Hủy"
                            : order.trang_thai;

              const rowStyle =
                order.trang_thai === "da_thanh_toan"
                  ? { backgroundColor: "#28a745", color: "white" }
                  : order.trang_thai === "cho_xac_nhan"
                    ? { backgroundColor: "#ffc107", color: "black" }
                    : order.trang_thai === "da_xac_nhan"
                      ? { backgroundColor: "blue", color: "white" }
                      : order.trang_thai === "dang_van_chuyen"
                        ? { backgroundColor: "#e2da14", color: "white" }
                        : order.trang_thai === "hoan_thanh"
                          ? { backgroundColor: "#28a745", color: "yellow" }
                          : order.trang_thai === "huy"
                            ? { backgroundColor: "red", color: "black" }
                            : {};

              return (
                <tr key={order.ma_don_hang}>
                  <td className="text-center" style={{ verticalAlign: 'middle' }}>{index + 1}</td>
                  <td className="text-center" style={{ verticalAlign: 'middle' }}>{order.so_luong}</td>
                  <td className="text-center" style={{ ...rowStyle, verticalAlign: 'middle' }}>
                    {orderStatus}
                  </td>
                  <td className="text-center" style={{ verticalAlign: 'middle' }}>{order.phuong_thuc_tt}</td>
                  <td className="text-center" style={{ verticalAlign: 'middle' }}>
                    {new Date(order.ngay_dat).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="text-center text-danger fw-bold" style={{ verticalAlign: 'middle' }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(order.tong_tien)}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/donhang/${order.ma_don_hang}`)}
                    >
                      Chi Tiết
                    </button>
                  </td>
                  <td className="text-center text-primary">
                    <strong onClick={() => handlePrintOrder(order)}>
                      <i className="bi bi-printer"></i> In đơn
                    </strong>
                  </td>
                  <td className="text-center" >
                    {order.trang_thai === "cho_xac_nhan" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelOrder(order.ma_don_hang)}
                      >
                        <i class="fa-solid fa-ban"></i> Hủy Đơn
                      </button>
                    )}
                    {order.trang_thai !== "cho_xac_nhan" && (
                      // <p>Không thể hủy</p>
                      <span className="text-muted">Không thể hủy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LichSuMua;
