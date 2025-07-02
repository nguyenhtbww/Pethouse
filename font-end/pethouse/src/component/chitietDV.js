import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

const ChiTietDV = () => {
  const { MaDH } = useParams(); // Lấy mã đơn hàng từ URL
  const [orderDetails, setOrderDetails] = useState([]); // Lưu danh sách chi tiết đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orderDetailServices/${MaDH}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải chi tiết đơn hàng.');
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug dữ liệu trả về

        if (data.status === 'success' && Array.isArray(data.data)) {
          setOrderDetails(data.data); // Lưu danh sách sản phẩm vào state
        } else {
          throw new Error('Không tìm thấy chi tiết đơn hàng.');
        }
      } catch (error) {
        setError(error.message); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchOrderDetails(); // Gọi API khi component mount
  }, [MaDH]);



  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải
  }

  if (error) {
    return <div>Error: {error}</div>; // Hiển thị lỗi nếu có
  }

  if (!orderDetails || orderDetails.length === 0) {
    return <div>Không tìm thấy chi tiết đơn hàng.</div>; // Hiển thị nếu không có dữ liệu
  }

  return (
    <div className="container mt-3">
      <div id="invoice"> {/* Phần tử hóa đơn */}
        <h2 className="float-start">Chi Tiết Đơn Hàng</h2>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center align-middle">STT</th>
              <th className="text-center align-middle">Dịch vụ</th>
              {/* <th className="text-center align-middle">Hình Ảnh</th> */}
              {/* <th className="text-center align-middle">Số Lượng</th> */}
              <th className="text-center align-middle">Đơn Giá</th>
              <th className="text-center align-middle">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail, index) => (
              <tr key={detail.MaCTDH}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">{detail.SanPham.TenSP}</td>
                {/* <td className="text-center align-middle">
                  <img
                    src={`../image/product/${detail.SanPham.HinhAnh}`}
                    alt={detail.SanPham.TenSP}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </td> */}
                {/* <td className="text-center align-middle">{detail.SoLuong}</td> */}
                <td className="text-center align-middle">{detail.DonGia.toLocaleString()} VND</td>
                <td className="text-center align-middle">{(detail.SoLuong * detail.DonGia).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChiTietDV;