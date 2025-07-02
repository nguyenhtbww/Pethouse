import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

function Header() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [cart, setCart] = useState([]);
  const { user, hasPermission, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
      if (window.innerWidth > 991) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const savedCart = sessionStorage.getItem("cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      setCart(parsedCart);
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const toggleMenu = () => {
    if (isMobile) setIsMenuOpen((prev) => !prev);
  };

  const clearAllStorage = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleLogout = () => {
    clearAllStorage();
    logout();
    setIsDropdownOpen(false);
  };

  const truncateProductName = (name, maxLength = 20) => {
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };

  return (
    <>
      <div id="logo" className="logo float-left">
        <Link to="/" title="logo">
          <img src="/image/Nen_trong_suot.png" alt="Logo" width={107} height={24} />
        </Link>
      </div>

      <div className="mobile-button" onClick={toggleMenu}>
        <span />
      </div>

      <ul className="menu-extra menu">
        <li className="box-search">
          <Link className="icon_search header-search-icon" to="/timkiem" />
          <form role="search" method="get" className="header-search-form" action="#">
            <input
              type="text"
              name="s"
              className="header-search-field"
              placeholder="Tìm kiếm..."
            />
            <button type="submit" className="header-search-submit" title="Search">
              Tìm kiếm
            </button>
          </form>

        </li>
        <li className="box-login">
          {user ? (
            <div
              className="user-menu"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="m-2">
                {typeof user === "string" ? user.slice(0, 6) : user?.Hovaten || "Người dùng"}
              </span>

              {isDropdownOpen && (
                <ul className="submenu px-2">
                  {user && hasPermission(1) && (
                    <>
                      <li className="m-0">
                        <Link className="text-nowrap" to="/admin">Trang quản trị</Link>
                      </li>
                      <li><hr /></li>
                    </>
                  )}
                  <li className="m-0">
                    <Link className="text-nowrap" to="/info">Tài khoản của tôi</Link>
                  </li>
                  <li>
                    <Link className="text-nowrap" to="/lichsumua">Lịch sử mua hàng</Link>
                  </li>
                  <li>
                    <Link className="text-nowrap" to="/lichsuDV">
                      Lịch sử dịch vụ
                    </Link>
                  </li>
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                      className="text-nowrap"
                    >
                      Đăng Xuất
                    </a>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link className="icon_login" to="/login" />
          )}
        </li>
        <li className="box-cart nav-top-cart-wrapper">
          <Link className="icon_cart nav-cart-trigger active" to="/giohang">
            <span>{cart.length}</span>
          </Link>
        </li>
      </ul>

      <div className="nav-wrap">
        <nav
          id="mainnav"
          className={`mainnav ${isMenuOpen && isMobile ? "open" : ""}`}
          style={{
            display: isMobile ? (isMenuOpen ? "block" : "none") : "block",
          }}
        >
          <ul className="menu">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">Trang chủ</Link>
            </li>
            <li className={location.pathname === "/sanpham" ? "active" : ""}>
              <Link to="/sanpham">Sản phẩm</Link>
            </li>
            <li className={location.pathname === "/datlich" ? "active" : ""}>
              <Link to="/datlich">Dịch vụ</Link>
            </li>
            <li className={location.pathname === "/tintuc" ? "active" : ""}>
              <Link to="/tintuc">Tin thú cưng</Link>
            </li>
            <li className={location.pathname === "/lienhe" ? "active" : ""}>
              <Link to="/lienhe">Liên hệ</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Header;
