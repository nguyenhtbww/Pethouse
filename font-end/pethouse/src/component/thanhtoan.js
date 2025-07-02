import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ThanhToan() {
  const [cart, setCart] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    address: "",
    Mataikhoan: "",
  });
  const [formData, setFormData] = useState({
    note: "",
    paymentMethod: "cod",
    couponCode: "", // Thêm mã giảm giá
  });
  const [discount, setDiscount] = useState(0); // Giá trị giảm giá
  const [couponError, setCouponError] = useState(""); // Lỗi mã giảm giá
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    setCart(savedCart ? JSON.parse(savedCart) : []);

    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData({
        name: parsedUser.Hovaten,
        phone: parsedUser.SDT,
        address: parsedUser.DiaChi,
        Mataikhoan: parsedUser.Mataikhoan || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => {
      return sum + item.quantity * parseInt(item.gia);
    }, 0);
    return total; // Tổng cộng sau khi trừ giảm giá
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);

    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) {
      setCouponError("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: formData.couponCode }),
      });

      const result = await response.json();

      if (response.ok) {
        if (calculateTotal() < result.min_order_value) {
          setCouponError(`Đơn hàng cần tối thiểu ${result.min_order_value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })} để áp dụng mã.`);
        } else {
          const discountValue =
            result.type === "percentage"
              ? (calculateTotal() * result.value) / 100
              : result.value;

          setDiscount(discountValue);
          setCouponError(""); // Xóa lỗi nếu thành công
          alert(`Áp dụng mã giảm giá thành công: Giảm ${discountValue.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`);
        }
      } else {
        setCouponError(result.error || "Mã giảm giá không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setCouponError("Không thể xác minh mã giảm giá. Vui lòng thử lại.");
    }
  };



  const handleSubmit = async () => {
    if (!userData.Mataikhoan || !userData.name || !userData.phone || !userData.address) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const orderData = {
      Mataikhoan: userData.Mataikhoan,
      PTTT:
        formData.paymentMethod === "cod"
          ? "Ship COD"
          : formData.paymentMethod === "vnpay"
            ? "VNPAY"
            : "MOMO",

      GhiChu: formData.note,
      TongTien: calculateTotal(), // Tổng tiền sau khi trừ giảm giá
      Discount: discount, // Giá trị giảm giá
      chi_tiet: cart.map((item) => ({
        MaSP: item.ma_san_pham,
        SoLuong: item.quantity,
      })),
    };

    try {
      if (formData.paymentMethod === "cod") {
        // Process normal order with COD
        const response = await fetch("http://127.0.0.1:8000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Đơn hàng đã được gửi thành công!");
          sessionStorage.removeItem("cart");
          const event = new Event("cartUpdated");
          window.dispatchEvent(event);
          setCart([]);
          navigate("/lichsumua");
        } else {
          alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        }
      } else if (formData.paymentMethod === "vnpay") {
        // Call VNPAY API if the payment method is VNPAY
        const response = await fetch("http://127.0.0.1:8000/api/Store/VnPay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", result);


        if (response.ok && result.status === "success") {
          sessionStorage.removeItem("cart");
          setCart([]);
          // Redirect to VNPAY payment page
          window.location.href = result.url; // Điều hướng người dùng đến URL thanh toán của VNPAY
        } else {
          alert("Lỗi khi kết nối với VNPAY. Vui lòng thử lại.");
        }

      } else if (formData.paymentMethod === "momo") {
        const response = await fetch("http://127.0.0.1:8000/api/Store/MOMO", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", result);


        if (response.ok && result.status === "success") {
          sessionStorage.removeItem("cart");
          setCart([]);

          const payUrl = result.url?.payUrl; // Truy xuất payUrl từ đối tượng url
          if (payUrl) {
            // Xóa giỏ hàng và điều hướng đến URL thanh toán của MoMo
            sessionStorage.removeItem("cart");
            const event = new Event("cartUpdated");
            window.dispatchEvent(event);
            setCart([]);
            window.location.href = payUrl;
          } else {
            alert("Không nhận được URL thanh toán từ MoMo. Vui lòng thử lại.");
          }
        } else {
          alert("Lỗi khi kết nối với MoMo. Vui lòng thử lại.");
        }

      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối tới máy chủ, vui lòng thử lại sau.");
    }
  };


  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">Chi tiết đơn hàng</h2>
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Hình ảnh</th>
                <th style={{ width: "20%", textAlign: "center" }}>Tên sản phẩm</th>
                <th style={{ textAlign: "center" }}>Số lượng</th>
                <th style={{ textAlign: "center" }}>Giá</th>
                <th style={{ textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>
                    <img
                      src={`image/product/${item.hinh_anh}`}
                      alt={item.ten_san_pham}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td className="align-middle" style={{ width: "40%" }}>{item.ten_san_pham}</td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleQuantityChange(index, Math.max(0, item.quantity - 1))} // Ensure quantity doesn't go below 0
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleQuantityChange(index, Math.min(10, item.quantity + 1))} // Ensure quantity doesn't exceed 10
                    >
                      +
                    </button>
                  </td>

                  <td className="text-center align-middle">
                    {parseInt(item.gia).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Tổng tiền:
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {(calculateTotal()).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
              </tr>
              <tr>
                <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Giảm giá:
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {discount > 0
                    ? `-${discount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}`
                    : "0 VND"}
                </td>
              </tr>
              <tr>
                <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Thanh toán:
                </td>
                <td style={{ textAlign: "center", fontWeight: "bold", color: "red" }}>
                  {(calculateTotal() - discount).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <h4 className="mb-4">Thông tin giao hàng</h4>
          <div className="mb-3">
            <label className="form-label">Tên</label>
            <input
              type="text"
              className="form-control"
              value={userData.name}
              name="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              value={userData.phone}
              name="phone"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              value={userData.address}
              name="address"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mã giảm giá</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={formData.couponCode}
                name="couponCode"
                onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                placeholder="Nhập mã giảm giá"
              />
              <button className="btn btn-primary" onClick={handleApplyCoupon}>
                Áp dụng
              </button>
            </div>
            {couponError && <small className="text-danger">{couponError}</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Ghi chú</label>
            <textarea
              name="note"
              className="form-control"
              placeholder="Ghi chú (tuỳ chọn)"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Phương thức thanh toán</label>
            <select
              name="paymentMethod"
              className="form-control"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="cod">Ship COD</option>
              <option value="vnpay">Thanh toán VNPAY</option>
              <option value="momo">Thanh toán MoMo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-right py-3">
        <button className="btn btn-success btn-lg" onClick={handleSubmit}>
          Thanh toán
        </button>
      </div>
    </div>
  );
}

export default ThanhToan;
