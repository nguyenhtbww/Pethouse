import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ChiTietSanPham() {
  let { id } = useParams();

  const [sp, ganSP] = useState(null);
  const [category, setCategory] = useState(null); // State for storing categories
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const [quantity, setQuantity] = useState(1); // State for the quantity of the product

  useEffect(() => {
    // Lấy dữ liệu sản phẩm
    fetch(`http://localhost:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu trả về:", data); // Kiểm tra dữ liệu
        if (data.status === "success") {
          ganSP(data.data); // Gán dữ liệu sản phẩm
        } else {
          console.error("Lỗi khi lấy dữ liệu:", data.message);
          ganSP(null); // Khởi tạo giá trị mặc định
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });

    // Lấy danh mục sản phẩm
    fetch("http://localhost:8000/api/category")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCategory(data.data); // Gán dữ liệu danh mục
        } else {
          console.error("Lỗi khi lấy dữ liệu danh mục:", data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
      });
  }, [id]);

  useEffect(() => {
    if (sp?.ma_danh_muc) {
      // Lấy các sản phẩm liên quan (cùng danh mục)
      fetch(`http://localhost:8000/api/products?category=${sp.ma_danh_muc}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            // Sắp xếp sản phẩm ngẫu nhiên và chỉ lấy 4 sản phẩm
            const shuffledProducts = data.data
              .sort(() => 0.5 - Math.random()) // Sắp xếp ngẫu nhiên
              .slice(0, 4); // Giới hạn 4 sản phẩm
            setRelatedProducts(shuffledProducts); // Gán dữ liệu sản phẩm liên quan
          } else {
            console.error("Lỗi khi lấy sản phẩm liên quan:", data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy sản phẩm liên quan:", error);
        });
    }
  }, [sp]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = () => {
    if (!sp) return; // Nếu không có sản phẩm, không làm gì cả

    // Kiểm tra nếu giỏ hàng đã có sản phẩm
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.ma_san_pham === sp.ma_san_pham);

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
      cart.push({
        ma_san_pham: sp.ma_san_pham,
        ten_san_pham: sp.ten_san_pham,
        hinh_anh: sp.hinh_anh,
        gia: sp.gia,
        quantity: quantity
      });
    }

    // Lưu giỏ hàng vào sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(cart));
    const event = new Event("cartUpdated");
    window.dispatchEvent(event);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // Hàm tăng số lượng sản phẩm
  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  // Hàm giảm số lượng sản phẩm
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  // Tìm tên danh mục từ mã danh mục
  const categoryName = category ? category.find(c => c.ma_danh_muc === sp?.ma_danh_muc)?.ten_danh_muc : "Không có danh mục";

  return (
    <>
      <div className="page-title parallax parallax1">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-light">
              <div className="page-title-heading">
                <h2 className="title">{sp ? sp.ten_san_pham : "Sản phẩm"}</h2>
              </div>
              <div className="breadcrumbs">
                <ul>
                  <li><Link to="/">Trang chủ</Link></li>
                  <li><Link to="/sanpham">Sản phẩm</Link></li>
                  <li><Link to="shop-detail-des.html">{sp ? sp.ten_san_pham : "Sản phẩm"}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="flat-row main-shop shop-detail">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center border border-warning border-2 rounded">
              <img
                src={`../image/product/${sp?.hinh_anh}`}
                className="card-img-top pt-5"
                alt={sp?.ten_san_pham}
                style={{ width: "75%" }}
              />
            </div>
            <div className="col-md-6">
              <div className="product-detail">
                <div className="inner">
                  <div className="content-detail">
                    <h2 className="product-title">{sp?.ten_san_pham}</h2>
                    <div className="product-categories">
                      <span className="fs-6">Danh mục: </span>
                      <a href="/#">{categoryName}</a>
                    </div>
                    <p><h5 className="fw-bold">Giới thiệu: </h5>{sp?.mo_ta}</p>
                    <div className="price">
                      <ins>
                        <span className="amount fs-3 fw-bold text-danger">
                          {parseInt(sp?.gia).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </ins>
                    </div>
                    <hr></hr>
                    <div className="product-quantity">
                      <h5 className="float-start my-2">Số lượng:   </h5>
                      <div className="quantity">

                        <span className="dec quantity-button" onClick={decreaseQuantity}>-</span>
                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="quantity-number"
                        />
                        <span className="inc quantity-button" onClick={increaseQuantity}>+</span>
                      </div>
                      
                      <div class="d-grid mt-5">
                        <button type="button" class="btn btn-warning btn-block" onClick={addToCart}>Thêm vào giỏ hàng</button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <section className="flat-row shop-related">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="title-section margin-bottom-55">
                  <h2 className="title">Sản phẩm liên quan</h2>
                </div>
                <div className="product-content product-fourcolumn clearfix">
                  <ul className="product style2">
                    {relatedProducts.map((sp) => (
                      <li className="product-item" key={sp.ma_san_pham}>
                        <div className="product-thumb clearfix">
                          <Link to={"/chitietsanpham/" + sp.ma_san_pham}>
                            <img
                              src={`../image/product/${sp.hinh_anh}`}
                              className="card-img-top mx-auto"
                              alt={sp.ten_san_pham}
                              style={{ width: "75%" }}
                            />
                          </Link>
                        </div>
                        <div className="product-info clearfix">
                          <span className="product-title">{sp.ten_san_pham}</span>
                          <div className="price">
                            <ins>
                              <span className="amount fs-6 fw-bold">
                                {parseInt(sp.gia).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </ins>
                          </div>
                        </div>
                        <div className="add-to-cart text-center">
                          <Link to={"/chitietsanpham/" + sp.ma_san_pham}>Xem chi tiết</Link>
                        </div>
                        <a href="/#" className="like">
                          <i className="fa fa-heart-o" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ChiTietSanPham;