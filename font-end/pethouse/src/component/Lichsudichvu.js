import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng để điều hướng
import { useAuth } from '../contexts/AuthContext'; // Lấy thông tin người dùng từ AuthContext

const Lichsudichvu = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng (bao gồm MaTaiKhoan)
  const [orders, setOrders] = useState([]); // Lưu trữ danh sách đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const navigate = useNavigate(); // Hook điều hướng

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.Mataikhoan) {
        setError('Không tìm thấy thông tin tài khoản.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orderServices/${user.Mataikhoan}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải dịch vụ. Vui lòng thử lại.');
        }

        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.data)) {
          setOrders(data.data); // Lưu danh sách dịch vụ
        } else {
          setOrders([]); // Không có dịch vụ nào
        }
      } catch (error) {
        setError(error.message); // Lưu thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchOrders(); // Gọi hàm lấy danh sách dịch vụ khi component mount
  }, [user]); // Chạy lại nếu thông tin user thay đổi

  // Xử lý hủy dịch vụ
  const handleCancelOrder = async (maDonHang) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy dịch vụ này không?")) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/donhang/trangthai/${maDonHang}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TrangThai: 'huy', // Chỉ gửi trạng thái "huy"
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        alert("Dịch vụ đã được hủy thành công!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.ma_don_hang === maDonHang
              ? { ...order, trang_thai: 'huy' } // Cập nhật trạng thái trong danh sách
              : order
          )
        );
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi hủy dịch vụ.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy dịch vụ:", error);
      alert(`Lỗi khi hủy dịch vụ: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải
  }

  if (error) {
    return <div>Error: {error}</div>; // Hiển thị lỗi nếu có
  }

  return (
    <div className="container mt-3">
      <h2>Lịch sử dịch vụ đã sử dụng</h2>
      {orders.length === 0 ? (
        <p>Chưa có dịch vụ nào.</p> // Nếu không có dịch vụ
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="text-center align-middle">STT</th>
              <th className="text-center align-middle">Mã Dịch Vụ</th>
              <th className="text-center align-middle">Tổng Tiền</th>
              <th className="text-center align-middle">Trạng Thái</th>
              <th className="text-center align-middle">Ngày Đặt</th>
              <th className="text-center align-middle">Xem Chi Tiết</th>
              <th className="text-center align-middle">Hủy Dịch Vụ</th>
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
                  <td className="text-center align-middle">{index + 1}</td>
                  <td className="text-center align-middle">{order.ma_don_hang}</td>
                  <td className="text-center align-middle">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tong_tien)}
                  </td>
                  <td className="text-center align-middle" style={{ ...rowStyle, verticalAlign: 'middle' }}>{orderStatus}</td>
                  <td className="text-center align-middle">
                    {new Date(order.ngay_su_dung).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      
                    })}
                  </td>

                  <td className="text-center align-middle">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => navigate(`/dichvu/${order.ma_don_hang}`)}
                    >
                      Xem Chi Tiết
                    </button>
                  </td>
                  <td className="text-center align-middle">
                    {order.trang_thai === "cho_xac_nhan" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelOrder(order.ma_don_hang)}
                      >
                        <i class="fa-solid fa-ban"></i> Hủy Dịch Vụ
                      </button>
                    ) : (
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

export default Lichsudichvu;
