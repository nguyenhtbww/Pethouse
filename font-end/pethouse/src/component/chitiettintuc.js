import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChiTietTinTuc = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/News/${id}`);
        if (!response.ok) {
          throw new Error("Không thể lấy bài viết.");
        }
        const data = await response.json();
        setArticle(data.data); // Điều chỉnh dựa trên cấu trúc phản hồi của API

        // Gọi hàm lấy bài viết liên quan
        if (data.data) {
          fetchRelatedArticles(data.data.ma_danh_muc_bv);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedArticles = async (categoryId) => {
      try {
        const response = await fetch(`http://localhost:8000/api/News?ma_danh_muc_bv=${categoryId}`);
        if (!response.ok) {
          throw new Error("Không thể lấy bài viết liên quan.");
        }
        const data = await response.json();
        setRelatedArticles(data.data); // Lưu danh sách bài viết liên quan
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArticle();
  }, [id]);

  // Chọn ngẫu nhiên một số bài viết liên quan
  const getRandomArticles = (articles, count) => {
    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }

  if (!article) {
    return <p>Bài viết không tồn tại.</p>;
  }

  // Lấy 3 bài viết liên quan ngẫu nhiên
  const randomRelatedArticles = getRandomArticles(relatedArticles, 10);

  return (
    <section className="blog posts" style={{ paddingTop: '20px' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="post-wrap detail">
              <article className="post clearfix">
                <div className="title-post">
                  <h2>{article.tieu_de}</h2>
                </div>
                <div className="content-post">
                  <ul className="meta-post">
                    <li className="author padding-left-2">
                      <span className=" fs-6">Đăng bởi: </span>
                      <a href="#">Admin</a>
                    </li>
                    <li className="comment">
                      <span><i class="fa-solid fa-eye"/> &nbsp;&nbsp;{article.luot_xem}</span>
                    </li>
                    <li className="date">
                    {/* <i class="fa-solid fa-calendar-days" style="color: #94919c;"></i> */}
                      <span><i className="fa-solid fa-calendar-days"/>&nbsp;&nbsp;&nbsp;{article.ngay_tao}</span>
                    </li>
                  </ul>
                  <div className="entry-post">
                    <p>{article.noi_dung}</p>
                  
                  </div>
                  <div className="featured-post ">
                  
                    <img src={`http://localhost:8000/image/News/${article.Hinh}`} salt="bài viết" />
                  </div>
                  <div className="entry-post">
                    
                    <p>{article.chi_tiet}</p>
                  </div>
                </div>
              </article>
            </div>

            <div className="main-single">
              <div className="comments-area">
                <ol className="comment-list">
                  {/* Bình luận sẽ được thêm ở đây */}
                </ol>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="widget widget_categories">
              <h3 className="widget-title">Bài viết liên quan</h3>
              <ul>
                {randomRelatedArticles.length > 0 ? (
                  randomRelatedArticles.map((related) => (
                    <li key={related.bai_viet}>
                      <a href={`/chitiettintuc/${related.bai_viet}`}>
                        <img
                          src={`http://localhost:8000/image/News/${related.Hinh}`}
                          alt={related.tieu_de}
                          style={{ width: '100%', height: 'auto', marginBottom: '5px' }}
                        />
                      </a>
                      <p className="fw-bolder" href={`/chitiettintuc/${related.bai_viet}`}>
                      {related.tieu_de}
                      </p>
                      
                    </li>
                  ))
                ) : (
                  <li><p>Không có bài viết liên quan.</p></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChiTietTinTuc;