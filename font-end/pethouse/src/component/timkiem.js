import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function TimKiem() {
  const [SanPham, DsSanPham] = useState([]); // Dữ liệu sản phẩm từ API
  const [TimKiem, setTimKiem] = useState(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

  // Lấy danh sách sản phẩm mặc định khi tải trang
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          DsSanPham(data.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          DsSanPham([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });
  }, []);

  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.ma_san_pham === product.ma_san_pham
    );

    let updatedCart;

    if (existingProductIndex !== -1) {
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Đã thêm vào giỏ hàng");
  };

  // Tìm kiếm sản phẩm từ API khi nhấn Enter
  const handleSearch = (e) => {
    if (e.key === "Enter" && TimKiem.trim() !== "") {
      setLoading(true); // Bắt đầu tải
      fetch("http://127.0.0.1:8000/api/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TenSanPham: TimKiem }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && Array.isArray(data.data)) {
            // Chuyển đổi dữ liệu từ API thành đúng cấu trúc cho React
            const formattedData = data.data.map((sp) => ({
              ma_san_pham: sp.ma_san_pham,
              ten_san_pham: sp.ten_san_pham,
              gia: sp.gia,
              hinh_anh: sp.hinh_anh,
              so_luong: sp.so_luong,
              mo_ta: sp.mo_ta,
            }));

            DsSanPham(formattedData);
          } else {
            console.error("Dữ liệu không hợp lệ:", data);
            DsSanPham([]);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tìm kiếm sản phẩm:", error);
          DsSanPham([]);
        })
        .finally(() => setLoading(false)); // Kết thúc tải
    }
  };

  return (
    <section className="flat-row row-product-new">
      <div className="container">
        {/* Thanh tìm kiếm */}
        <div className="row mb-4">
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm..."
              value={TimKiem}
              onChange={(e) => setTimKiem(e.target.value)}
              onKeyDown={handleSearch} // Gọi hàm xử lý khi nhấn phím
            />
          </div>
        </div>
        {/* Danh sách sản phẩm */}
        <div className="row">
          <div className="col-md-12">
            <div className="title-section margin-bottom-52">
              <h2 className="title">Danh sách sản phẩm</h2>
            </div>
            <div className="product-content product-fourcolumn clearfix">
              {loading ? (
                <p className="text-center">Đang tải...</p>
              ) : (
                <ul className="product style2 clearfix">
                  {SanPham.map((sp, i) => (
                    <li className="product-item" key={i}>
                      <div className="product-thumb clearfix">
                        <Link
                          to={`/chitietsanpham/${sp.ma_san_pham}`}
                          className="product-link"
                        >
                          <img
                            src={`image/product/${sp.hinh_anh}`}
                            alt={sp.ten_san_pham}
                          />
                        </Link>
                        <span className="new">Mới</span>
                      </div>

                      <div className="product-info text-center clearfix">
                        <span className="product-title box-title">
                          {sp.ten_san_pham}
                        </span>
                        <div className="price">
                          <ins>
                            <span className="amount">
                              {parseInt(sp.gia).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </ins>
                        </div>
                      </div>
                      <div className="add-to-cart text-center">
                        <Link onClick={() => addToCart(sp)}>
                          THÊM VÀO GIỎ HÀNG
                        </Link>
                      </div>
                      <a href="/" className="like">
                        <i className="fa fa-heart-o" />
                      </a>
                    </li>
                  ))}
                  {/* Hiển thị thông báo nếu không có sản phẩm nào */}
                  {SanPham.length === 0 && !loading && (
                    <p className="text-center mt-3">
                      Không tìm thấy sản phẩm nào!
                    </p>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TimKiem;
