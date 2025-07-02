import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GioHang() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    if (quantity <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = quantity;
    }
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveProduct = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotalPrice = (price, quantity) => price * quantity;

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.gia * item.quantity, 0);
  };

  return (
    <section className="cart-page py-5">
      <div className="container">
        <h2 className="title text-center mb-4">Giỏ hàng của bạn</h2>
        {cart.length === 0 ? (
          <p className="text-center">Giỏ hàng hiện đang trống.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="thead-dark">
                <tr>
                  <th style={{ width: "5%", textAlign: "center", verticalAlign: "middle" }}>STT</th>
                  <th style={{ width: "20%", verticalAlign: "middle" }}>Sản phẩm</th>
                  <th style={{ width: "15%", textAlign: "center", verticalAlign: "middle" }}>Hình ảnh</th>
                  <th style={{ width: "15%", textAlign: "center", verticalAlign: "middle" }}>Đơn giá</th>
                  <th style={{ width: "10%", textAlign: "center", verticalAlign: "middle" }}>Số lượng</th>
                  <th style={{ width: "20%", textAlign: "center", verticalAlign: "middle" }}>Tổng cộng</th>
                  <th style={{ width: "15%", textAlign: "center", verticalAlign: "middle" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center align-middle">{index + 1}</td>
                    <td className="align-middle">
                      <strong>{item.ten_san_pham}</strong>
                    </td>
                    <td className="text-center align-middle">
                      <img
                        src={`image/product/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className="img-fluid rounded"
                        style={{
                          maxWidth: "80px",
                          height: "auto",
                        }}
                      />
                    </td>
                    <td className="text-center align-middle">
                      {parseInt(item.gia).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="text-center align-middle">
                      <input
                        type="number"
                        value={item.quantity}
                        min="0"
                        max="10"
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value))
                        }
                        className="form-control text-center"
                        style={{ maxWidth: "70px", margin: "auto" }}
                      />
                    </td>
                    <td className="text-center align-middle">
                      {parseInt(
                        calculateTotalPrice(item.gia, item.quantity)
                      ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="btn btn-danger btn-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-right font-weight-bold align-middle">
                    Tổng giá trị giỏ hàng
                  </td>
                  <td className="text-center font-weight-bold align-middle">
                    {parseInt(calculateCartTotal()).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <div className="d-flex flex-column flex-sm-row justify-content-between mt-4">
          <Link to="/sanpham">
            <button className="btn btn-secondary btn-lg mb-2 mb-sm-0">Tiếp tục mua sắm</button>
          </Link>
          {cart.length > 0 && (
            <Link to="/formthanhtoan">
              <button className="btn btn-success btn-lg">Thanh toán</button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default GioHang;
