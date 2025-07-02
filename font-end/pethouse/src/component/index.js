import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Index() {
  const [NewProduct, ListNewProduct] = useState([]);
  const [tintuc, setTinTuc] = useState([]);
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


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const data = await response.json();
        ListNewProduct(data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);



  useEffect(() => {
    const fetchTinTuc = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/News");
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setTinTuc(data.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          setTinTuc([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        setTinTuc([]);
      }
    };

    fetchTinTuc();
  }, []);

  const truncateContent = (content, limit) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };

  const [allProducts, setAllProducts] = useState([]); // Sản phẩm tất cả
  const [dogProducts, setDogProducts] = useState([]); // Sản phẩm cho chó
  const [catProducts, setCatProducts] = useState([]); // Sản phẩm cho mèo

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ ...item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort, ...item }) => item);
  };

  // Hàm gọi API
  const fetchProductsByCategory = async (categoryId, setter) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/sanPhamTheoDM/${categoryId}`
      );
      const data = await response.json();
      if (data && data.data) {
        setter(data.data);
      }
    } catch (error) {
      console.error(`Lỗi khi tải sản phẩm danh mục ${categoryId}:`, error);
    }
  };

  useEffect(() => {
    // Gọi API cho tất cả danh mục
    fetchProductsByCategory(4, setDogProducts); // Chó
    fetchProductsByCategory(25, setCatProducts); // Mèo
    fetch(`http://127.0.0.1:8000/api/products`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          const shuffledProducts = shuffleArray(data.data); // Xáo trộn sản phẩm
          setAllProducts(shuffledProducts);
        }
      })
      .catch((error) => console.error("Lỗi khi tải sản phẩm tất cả:", error));
  }, []);

  return (
    <>
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={0}
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={1}
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={2}
            aria-label="Slide 3"
          />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="image/slider/banner-1.png"
              className="d-block w-100"
              alt="image/banner_index.webp"
            />
          </div>
          <div className="carousel-item">
            <img
              src="image/slider/banner-2.png"
              className="d-block w-100"
              alt="image/banner_index.webp"
            />
          </div>
          <div className="carousel-item">
            <img
              src="image/slider/banner-3.png"
              className="d-block w-100"
              alt="image/banner_index.webp"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <section class="flat-row row-image-box">
        <div class="container">
          <div className="row gutter-10">
            <div className="col-sm-6 col-md-4">
              <div className="flat-image-box style-1 data-effect div-h22 clearfix">
                <div className="item data-effect-item">
                  <div className="inner">
                    <div className="thumb">
                      <img src="image/banner_new.webp" alt="hinh" />
                      <div className="elm-btn">
                        <a
                          href="#"
                          className="themesflat-button bg-white width-150"
                        >
                          Cho chó
                        </a>
                      </div>
                      <div className="overlay-effect bg-color-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-4 */}
            <div className="col-sm-6 col-md-4">
              <div className="flat-image-box style-1 row2 data-effect clearfix">
                <div className="item data-effect-item">
                  <div className="inner">
                    <div className="thumb">
                      <img
                        src="image/352a36db-cach-nuoi-chuot-hamster.jpg"
                        alt="hinh"
                      />
                      <div className="elm-btn">
                        <a
                          href="#"
                          className="themesflat-button bg-white width-150"
                        >
                          Mua ngay
                        </a>
                      </div>
                      <div className="overlay-effect bg-color-1" />
                    </div>
                  </div>
                </div>
                <div className="item data-effect-item">
                  <div className="inner">
                    <div className="thumb">
                      <img
                        src="image/beyjif6gmney6024ighvm66jnnet_banner-1.1.jpg"
                        alt="hinh"
                      />
                      <div className="elm-btn">
                        <a
                          href="#"
                          className="themesflat-button bg-white width-150"
                        >
                          Mua ngay
                        </a>
                      </div>
                      <div className="overlay-effect bg-color-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-4 */}
            <div className="col-sm-6 col-md-4">
              <div className="flat-image-box style-1 data-effect div-h20 clearfix">
                <div className="item data-effect-item">
                  <div className="inner">
                    <div className="thumb">
                      <img src="image/banner_goodprice.webp" alt="hinh" />
                      <div className="elm-btn">
                        <a
                          href="#"
                          className="themesflat-button bg-white width-150"
                        >
                          Cho mèo
                        </a>
                      </div>
                      <div className="overlay-effect bg-color-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-4 */}
          </div>
        </div>
      </section>

      <section class="flat-row row-product-new">
        <div class="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title-section margin-bottom-52">
                <h2 className="title">Sản Phẩm Mới</h2>
              </div>
              <div className="product-content product-fourcolumn clearfix">
                <ul className="product style2 clearfix">
                  {NewProduct.slice(0, 4).map((sp, i) => (
                    <li className="product-item" key={i}>
                      <div className="product-thumb clearfix">
                        <Link
                          to={`/chitietsanpham/${sp.ma_san_pham}`}
                          className="product-link"
                        >
                          <img
                            src={`http://localhost:8000/image/product/${sp.hinh_anh}`}
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
                        <Link onClick={() => addToCart(sp)}>
                          THÊM VÀO GIỎ HÀNG
                        </Link>
                      </div>
                      <a href="/" className="like">
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

      <section class="flat-row row-animation-box bg-section row-1">
        <div class="container">
          <div className="row">
            <div className="col-md-12">
              <div className="flat-animation-block">
                <div className="title-section width-before-17 bg-before-white margin-bottom-14">
                  <h2 className="title font-size-40 line-height-76">
                    Ưu đãi hấp dẫn khi mua sản phẩm
                  </h2>
                  <div className="sub-title fs-1">
                    <span className="fs-3 text-light fw-bold">Sản phẩm chính hãng của Pet houe</span>
                  </div>
                </div>
                <div className="elm-btn text-center">
                  <Link
                    to="/sanpham"
                    className="themesflat-button bg-accent has-padding-36"
                  >
                    Xem Ngay
                  </Link>
                </div>
              </div>
              {/* /.flat-animation-block */}
            </div>
          </div>
        </div>
      </section>

      <section className="flat-row row-product-project style-1">
        <div className="title-section margin-bottom-41">
          <h2 className="title">Sản Phẩm</h2>
        </div>
        <ul className="nav nav-tabs d-flex justify-content-center">
          <li className="nav-item">
            <a
              className="nav-link text-dark fw-bold active"
              data-bs-toggle="tab"
              href="#home"
            >
              Tất cả
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-dark fw-bold"
              data-bs-toggle="tab"
              href="#menu1"
            >
              Cho chó
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-dark fw-bold"
              data-bs-toggle="tab"
              href="#menu2"
            >
              Cho mèo
            </a>
          </li>
        </ul>
        {/* Nội dung các tab */}
        <div className="tab-content">
          {/* Tab Tất cả */}
          <div className="tab-pane container active" id="home">
            <div className="divider h54" />
            <div className="product-content product-fourcolumn clearfix">
              <ul className="product style2 isotope-product clearfix">
                {allProducts.slice(0, 8).map((sp, i) => (
                  <li className="product-item" key={i}>
                    <Link to={`/chitietsanpham/${sp.ma_san_pham}`}>
                      <div className="product-thumb clearfix">
                        <img
                          src={`http://localhost:8000/image/product/${sp.hinh_anh}`}
                          alt={sp.ten_san_pham}
                        />
                        <span className="new">Mới</span>
                      </div>
                      <div className="product-info text-center clearfix">
                        <span className="product-title box-title">
                          {sp.ten_san_pham}
                        </span>
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
                        <Link onClick={() => addToCart(sp)}>
                          THÊM VÀO GIỎ HÀNG
                        </Link>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tab Cho chó */}
          <div className="tab-pane container fade" id="menu1">
            <div className="divider h54" />
            <div className="product-content product-fourcolumn clearfix">
              <ul className="product style2 isotope-product clearfix">
                {dogProducts.slice(0, 8).map((sp, i) => (
                  <li className="product-item" key={i}>
                    <Link to={`/chitietsanpham/${sp.ma_san_pham}`}>
                      <div className="product-thumb clearfix">
                        <img
                          src={`image/product/${sp.hinh_anh}`}
                          alt={sp.ten_san_pham}
                        />
                        <span className="new">Mới</span>
                      </div>
                      <div className="product-info text-center clearfix">
                        <span className="product-title box-title">
                          {sp.ten_san_pham}
                        </span>
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
                        <Link onClick={() => addToCart(sp)}>
                          THÊM VÀO GIỎ HÀNG
                        </Link>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tab Cho mèo */}
          <div className="tab-pane container fade" id="menu2">
            <div className="divider h54" />
            <div className="product-content product-fourcolumn clearfix">
              <ul className="product style2 isotope-product clearfix">
                {catProducts.slice(0, 8).map((sp, i) => (
                  <li className="product-item" key={i}>
                    <Link to={`/chitietsanpham/${sp.ma_san_pham}`}>
                      <div className="product-thumb clearfix">
                        <img
                          src={`image/product/${sp.hinh_anh}`}
                          alt={sp.ten_san_pham}
                        />
                        <span className="new">Mới</span>
                      </div>
                      <div className="product-info text-center clearfix">
                        <span className="product-title box-title">
                          {sp.ten_san_pham}
                        </span>
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
                        <Link onClick={() => addToCart(sp)}>
                          THÊM VÀO GIỎ HÀNG
                        </Link>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-row row-icon-box bg-section bg-color-f5f">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="flat-icon-box icon-top style-1 clearfix text-center">
                <div className="inner no-margin">
                  <div className="icon-wrap">
                    <i className="fa fa-truck" />
                  </div>
                  <div className="text-wrap">
                    <h5 className="heading">
                      <a href="#">Miễn phí vận chuyển</a>
                    </h5>
                    <p className="desc">
                      Miễn phí vận chuyển cho đơn hàng trên 200k
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-3 */}
            <div className="col-md-3">
              <div className="flat-icon-box icon-top style-1 clearfix text-center">
                <div className="inner">
                  <div className="icon-wrap">
                    <i className="fa fa-money" />
                  </div>
                  <div className="text-wrap">
                    <h5 className="heading">
                      <a href="#">Thanh toán khi nhận hàng</a>
                    </h5>
                    <p className="desc">Miễn phí vận chuyển trên toán quốc</p>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-3 */}
            <div className="col-md-3">
              <div className="flat-icon-box icon-top style-1 clearfix text-center">
                <div className="inner">
                  <div className="icon-wrap">
                    <i className="fa fa-gift" />
                  </div>
                  <div className="text-wrap">
                    <h5 className="heading">
                      <a href="#">Quà tặng cho tất cả</a>
                    </h5>
                    <p className="desc">Nhận Quà Khi Đăng Ký</p>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-3 */}
            <div className="col-md-3">
              <div className="flat-icon-box icon-top style-1 clearfix text-center">
                <div className="inner">
                  <div className="icon-wrap">
                    <i className="fa fa-clock-o" />
                  </div>
                  <div className="text-wrap">
                    <h5 className="heading">
                      <a href="#">Mở cửa cả tuần</a>
                    </h5>
                    <p className="desc">6.00 am - 17.00pm</p>
                  </div>
                </div>
              </div>
            </div>
            {/* /.col-md-3 */}
          </div>
        </div>
      </section>

      <section className="flat-row row-new-latest">
        <div className="title-section margin-bottom-41">
          <h2 className="title">Tin Thú Cưng</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="post-wrap mb-4">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                  {tintuc.length > 0 ? (
                    tintuc.slice(0, 4).map((article) => (
                      <div className="col" key={article.bai_viet}>
                        <article className="post clearfix">
                          <div className="featured-post">
                            <img
                              src={`image/News/${article.Hinh}`}
                              alt={article.tieu_de}
                              className="img-fluid"
                              style={{
                                objectFit: 'cover',
                                width: '100%', // Giới hạn chiều rộng của hình ảnh
                                height: '200px', // Giới hạn chiều cao của hình ảnh
                              }}
                            />
                          </div>
                          <div className="content-post mt-2">
                            <div className="title-post">
                              <h2>
                                <Link to={`/chitiettintuc/${article.bai_viet}`}>
                                  {truncateContent(article.tieu_de, 45)}
                                </Link>
                              </h2>
                            </div>
                            <div className="entry-post">
                              <p>{truncateContent(article.noi_dung, 100)}</p>
                              <div className="more-link">
                                <Link to={`/chitiettintuc/${article.bai_viet}`}>Đọc thêm</Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      </div>
                    ))
                  ) : (
                    <p>Không có bài viết nào.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="flat-row mail-chimp">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="text">
                <h3>Nhập email để liên hệ với tôi</h3>
              </div>
            </div>
            <div className="col-md-8">
              <div className="subscribe clearfix">
                <form
                  action="#"
                  method="post"
                  acceptCharset="utf-8"
                  id="subscribe-form"
                >
                  <div className="subscribe-content">
                    <div className="input">
                      <input
                        type="email"
                        name="subscribe-email"
                        placeholder="Nhập Email của bạn"
                      />
                    </div>
                    <div className="button">
                      <button type="button">Gửi</button>
                    </div>
                  </div>
                </form>
                <ul className="flat-social">
                  <li>
                    <a href="/#">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fa fa-google" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fa fa-behance" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fa fa-linkedin" />
                    </a>
                  </li>
                </ul>
                {/* /.flat-social */}
              </div>
              {/* /.subscribe */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Index;