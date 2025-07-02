function Footer() {
    return (
        <div className="row bg-footer">
            <div className="col-sm-6 col-md-3">
                <div className="widget widget-link">
                    <ul>
                        <li>
                            <a href="#">Về chúng tôi</a>
                        </li>
                        <li>
                            <a href="#">Sản phẩm cho chó</a>
                        </li>
                        <li>
                            <a href="blog-list.html">Sản phẩm cho mèo</a>
                        </li>
                        <li>
                            <a href="contact.html">Dịch vụ chăm sóc</a>
                        </li>
                    </ul>
                </div>
                {/* /.widget */}
            </div>
            {/* /.col-md-3 */}
            <div className="col-sm-6 col-md-3">
                <div className="widget widget-link link-login">
                    <ul>
                        <li>
                            <a href="#">Đăng nhập/ Đăng ký</a>
                        </li>
                        <li>
                            <a href="#">Your Cart</a>
                        </li>
                        <li>
                            <a href="#">Wishlist items</a>
                        </li>
                        <li>
                            <a href="#">Your checkout</a>
                        </li>
                    </ul>
                </div>
                {/* /.widget */}
            </div>
            {/* /.col-md-3 */}
            <div className="col-sm-6 col-md-3">
                <div className="widget widget-link link-faq">
                    <ul>
                        <li>
                            <a href="faqs.html">FAQs</a>
                        </li>
                        <li>
                            <a href="#">Term of service</a>
                        </li>
                        <li>
                            <a href="#">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#">Returns</a>
                        </li>
                    </ul>
                </div>
                {/* /.widget */}
            </div>
            {/* /.col-md-3 */}
            <div className="col-sm-6 col-md-3">
                <div className="widget widget-brand">
                    <div className="logo logo-footer">
                        <a href="index.html">
                            <img src="/image/Nen_trong_suot.png" alt="image" width={107} height={24} />
                        </a>
                    </div>
                    <ul className="flat-contact">
                        <li className="address">Tô ký, phường Trung Mỹ Tây, quận 12, TP.HCM</li>
                        <li className="phone">0962491715</li>
                        <li className="email">pethose@gmail.com</li>
                    </ul>
                    {/* /.flat-contact */}
                </div>
                {/* /.widget */}
            </div>
            {/* /.col-md-3 */}
        </div>

    )
}
export default Footer