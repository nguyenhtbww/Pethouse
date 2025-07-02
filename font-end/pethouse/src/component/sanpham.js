import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "../App.css";

function SanPham() {
  const [list_sp, ganSP] = useState([]);
  const [filteredSP, setFilteredSP] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 24; // Số sản phẩm trên mỗi trang

  const toggleFilter = () => setFilterVisible(!isFilterVisible);
  const toggleSearch = () => setSearchVisible(!isSearchVisible);

  // Fetch danh sách sản phẩm
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          ganSP(data.data);
          setFilteredSP(data.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          ganSP([]);
          setFilteredSP([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });
  }, []);

  // Fetch danh sách danh mục
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/category")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
      });
  }, []);

  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const addToCart = (product) => {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(
      (item) => item.ma_san_pham === product.ma_san_pham
    );

    let updatedCart;

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã có, cập nhật số lượng
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa có, thêm mới vào giỏ
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    // Cập nhật lại trạng thái giỏ hàng
    setCart(updatedCart);

    // Lưu giỏ hàng vào sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));

    // Phát ra sự kiện để các component khác lắng nghe và cập nhật (bao gồm Header)
    window.dispatchEvent(new Event("cartUpdated"));

    alert("Đã thêm vào giỏ hàng");
  };
  // Lọc sản phẩm theo danh mục
  const filterByCategory = (maDanhMuc) => {
    setActiveCategory(maDanhMuc); // Đặt danh mục active
    if (maDanhMuc === "all") {
      setFilteredSP(list_sp);
    } else {
      fetch(`http://127.0.0.1:8000/api/products/sanPhamTheoDM/${maDanhMuc}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            setFilteredSP(data.data);
          } else {
            console.error("Dữ liệu không phải là mảng:", data);
            setFilteredSP([]);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        });
    }
    setCurrentPage(0); // Reset trang khi đổi danh mục
  };

  // Lọc sản phẩm khi tìm kiếm
  useEffect(() => {
    const filtered = list_sp.filter((sp) =>
      sp.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSP(filtered);
    setCurrentPage(0); // Reset trang khi tìm kiếm
  }, [searchTerm, list_sp]);

  // Phân trang
  const offset = currentPage * pageSize;
  const spTrong1Trang = filteredSP.slice(offset, offset + pageSize);
  const tongSoTrang = Math.ceil(filteredSP.length / pageSize);

  const chuyenTrang = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="header_sticky header-style-2 has-menu-extra">
        <div className="boxed">
          <div className="page-title parallax parallax1">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="page-title-heading">
                    <h1 className="title text-light">Sản phẩm</h1>
                  </div>
                  <div className="breadcrumbs">
                    <ul className="px-0">
                      <li>
                        <Link to="/">Trang chủ</Link>
                      </li>
                      <li>Sản phẩm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="flat-row main-shop shop-4col">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="filter-shop bottom_68 clearfix">
                    <p className="showing-product">Hiển thị sản phẩm</p>
                    <ul className="flat-filter-search">
                      <li>
                        <a
                          href="#"
                          className="show-filter text-black"
                          onClick={toggleFilter}
                        >
                          {isFilterVisible ? "Ẩn bộ lọc" : "Lọc sản phẩm"}
                        </a>
                      </li>
                      <li className="search-product">
                        <a
                          href="#"
                          className="text-black"
                          onClick={toggleSearch}
                        >
                          Tìm kiếm
                        </a>
                      </li>
                    </ul>
                  </div>

                  {isFilterVisible && (
                    <div className="box-filter slidebar-shop clearfix">
                      <div className="widget widget_tag">
                        <h5 className="widget-title">Danh mục</h5>
                        <div className="tag-list">
                          <a
                            href="#"
                            className={activeCategory === "all" ? "active" : ""}
                            onClick={() => filterByCategory("all")}
                          >
                            Tất cả
                          </a>
                          {categories.map((dm) => (
                            <a
                              key={dm.ma_danh_muc}
                              href="#"
                              className={
                                activeCategory === dm.ma_danh_muc
                                  ? "active"
                                  : ""
                              }
                              onClick={() => filterByCategory(dm.ma_danh_muc)}
                            >
                              {dm.ten_danh_muc}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isSearchVisible && (
                    <div className="shop-search clearfix">
                      <form
                        role="search"
                        method="get"
                        className="search-form"
                        action="#"
                      >
                        <label>
                          <input
                            type="search"
                            className="search-field"
                            placeholder="Tìm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </label>
                      </form>
                    </div>
                  )}

                  {filteredSP.length === 0 ? (
                    <p>Danh mục này hiện chưa có sản phẩm.</p>
                  ) : (
                    <>
                      <div className="product-content product-fourcolumn clearfix">
                        <ul className="product style2">
                          {spTrong1Trang.map((sp, i) => (
                            <li className="product-item" key={i}>
                              <div className="product-thumb clearfix">
                                <Link to={`/chitietsanpham/${sp.ma_san_pham}`}>
                                  <img
                                    src={`http://localhost:8000/image/product/${sp.hinh_anh}`}
                                    className="card-img-top mx-auto w-75 pb-3"
                                    alt={sp.ten_san_pham}
                                  />
                                </Link>
                              </div>
                              <div className="product-info clearfix">
                                <span className="product-title">
                                  {sp.ten_san_pham}
                                </span>
                                <div className="price">
                                  <ins>
                                    <span className="amount fs-6 fw-bold">
                                      {parseInt(sp.gia).toLocaleString(
                                        "vi-VN",
                                        {
                                          style: "currency",
                                          currency: "VND",
                                        }
                                      )}
                                    </span>
                                  </ins>
                                </div>
                              </div>
                              <div className="add-to-cart text-center">
                                <Link onClick={() => addToCart(sp)}>
                                  THÊM VÀO GIỎ HÀNG
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <ReactPaginate
                          nextLabel=">"
                          previousLabel="<"
                          pageCount={tongSoTrang}
                          pageRangeDisplayed={5}
                          onPageChange={chuyenTrang}
                          className="thanhphantrang"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default SanPham;
