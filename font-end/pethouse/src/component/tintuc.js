import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TinTuc() {
  const [tintuc, setTinTuc] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12; // Number of articles per page

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

  // Calculate total pages
  const totalPages = Math.ceil(tintuc.length / articlesPerPage);

  // Get current articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = tintuc.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <>
      <div className="page-title parallax parallax1">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-light">
              <div className="page-title-heading">
                <h1 className="title">Tin thú cưng</h1>
              </div>
              <div className="breadcrumbs">
                <ul className="px-0">
                  <li>
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li>
                    <Link to="/tintuc">Tin tức thú cưng</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="blog-posts grid-posts">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="post-wrap mb-4">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                  {currentArticles.length > 0 ? (
                    currentArticles.map((article) => (
                      <div className="col" key={article.bai_viet}>
                        <article className="post clearfix">
                          <div className="featured-post">
                            <img
                              src={`image/News/${article.Hinh}`}
                              alt={article.tieu_de}
                              className="img-fluid"
                              style={{
                                objectFit: 'cover',
                                width: '100%', // Chiều rộng ảnh ảnh căn giữa và giới hạn chiều rộng của nó
                                height: '200px', // Giới hạn chiều cao của hình ảnh
                              }}
                            />
                          </div>
                          <div className="content-post mt-3">
                            <div className="title-post">
                              <h2>
                                <Link className="fw-bolder fs-5" to={`/chitiettintuc/${article.bai_viet}`}>
                                  {article.tieu_de}
                                </Link>
                              </h2>
                            </div>
                            <div className="entry-post">
                              <p>{truncateContent(article.noi_dung, 110)}</p>
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

              {/* Phân trang */}
              <div className="blog-pagination text-center clearfix">
                <ul className="flat-pagination">
                  <li className="prev">
                    <a
                      onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                      disabled={currentPage === 1}
                    >
                      <i className="fa fa-angle-left" />
                    </a>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={currentPage === index + 1 ? "active" : ""}>
                      <a onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className="next">
                    <a
                      onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fa fa-angle-right" />
                    </a>
                  </li>
                </ul>
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
                <h3>Đăng ký nhận bản tin</h3>
              </div>
            </div>
            <div className="col-md-8">
              <div className="subscribe clearfix">
                <form action="#" method="post" acceptCharset="utf-8" id="subscribe-form">
                  <div className="subscribe-content">
                    <div className="input">
                      <input type="email" name="subscribe-email" placeholder="Email của bạn" />
                    </div>
                    <div className="button">
                      <button type="button">ĐĂNG KÝ</button>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TinTuc;