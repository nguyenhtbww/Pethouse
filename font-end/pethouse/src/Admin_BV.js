import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function Admin_bv() {
    const { user } = useAuth();
    const [list_bv, ganBV] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        fetch("http://localhost:8000/api/News")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    ganBV(data.data);
                } else {
                    ganBV([]);
                }
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu bài viết:", error);
            });
    }, []);

    const xoaBaiViet = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            fetch(`http://localhost:8000/api/News/${id}`, {
                method: "DELETE",
            })
                .then((res) => {
                    if (res.ok) {
                        ganBV((prevList) => prevList.filter((item) => item.bai_viet !== id));
                        alert("Bài viết đã được xóa thành công!");
                    } else {
                        alert("Lỗi khi xóa bài viết.");
                    }
                })
                .catch((error) => {
                    console.error("Lỗi khi xóa bài viết:", error);
                });
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = list_bv.slice(indexOfFirstPost, indexOfLastPost);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(list_bv.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container-fluid">
            <div className="row">
            <div
                    id="openMenu"
                    className="col-md-2 p-0 bg-primary collapse collapse-horizontal show"
                    style={{ minHeight: "100vh" }}
                >
                    <Link to={"/"}>
                        <img
                            src={`http://localhost:8000/image/Nen_trong_suot.png`}
                            className="d-block w-75 mx-auto"
                            alt={`http://localhost:8000/image/Nen_trong_suot.png`}
                        />
                    </Link>

                    <div className="list-group list-group-item-primary">
                        <Link to={"/admin"} className="list-group-item list-group-item-action mt-2 mb-0 rounded-0" aria-current="true">
                            <h5 className="mb-0 py-1">Tổng quan</h5>
                        </Link>
                        <Link to={"/adminsanpham"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Sản phẩm</h5>
                        </Link>
                        <Link to={"/admindichvuchamsoc"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Dịch vụ chăm sóc</h5>
                        </Link>
                        <Link to={"/admindanhmuc"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Danh mục</h5>
                        </Link>
                        <Link to={"/admintaikhoan"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Tài khoản</h5>
                        </Link>
                        <Link to={"/admindonhang"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Đơn hàng</h5>
                        </Link>
                        <Link to={"/admindatlich"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Đặt lịch</h5>
                        </Link>
                        <Link to={"/Admin_BV"} className="list-group-item list-group-item-action my-0 rounded-0 active">
                            <h5 className="mb-0 py-1">Tin tức</h5>
                        </Link>
                        <Link to={"/adminlienhe"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Liên hệ</h5>
                        </Link>
                        <Link to={"/adminmagiamgia"} className="list-group-item list-group-item-action my-0 rounded-0">
                            <h5 className="mb-0 py-1">Mã giảm giá</h5>
                        </Link>
                    </div>
                </div>

                <div className="col-md p-0">
                    {/* ... Navbar ... */}
                    <div className="container">
                        <Link to={"/Admin_ThemBV"} className="btn btn-success float-end">Thêm Tin Tức</Link>
                        <h2 className="my-3">Tin tức</h2>
                        <table className="table align-middle table-borderless">
                            <thead>
                                <tr>
                                    <th className="fw-bold text-center">STT</th>
                                    <th className="fw-bold text-center">Ảnh</th>
                                    <th className="fw-bold">Tên bài viết</th>
                                    <th className="fw-bold text-center">Danh mục</th>
                                    <th className="fw-bold text-center">Ngày tạo</th>
                                    <th className="fw-bold text-center">Lượt xem</th>
                                    <th className="fw-bold text-center text-nowrap">Trạng thái</th>
                                    <th className="fw-bold text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map((item, index) => (
                                    <tr key={item.bai_viet}>
                                        <td className="text-center">{index + 1 + (currentPage - 1) * postsPerPage}</td>
                                        <td className="text-center">
                                            <img src={`http://localhost:8000/image/News/${item.Hinh}`} style={{ width: "100px", height: "auto" }} />
                                        </td>
                                        <td>{item.tieu_de}</td>
                                        <td className="text-center">{item.ma_danh_muc_bv}</td>
                                        <td className="text-center">{item.ngay_tao}</td>
                                        <td className="text-center">{item.luot_xem}</td>
                                        <td className="text-center">{item.trang_thai === "1" ? "Hiện " : "Ẩn"}</td>
                                        <td className="text-center">
                                            <Link to={`/Admin_SuaBV/${item.bai_viet}`} className="btn btn-outline-warning m-1">
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>
                                            <button onClick={() => xoaBaiViet(item.bai_viet)} className="btn btn-outline-danger m-1">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Phân trang */}
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className="page-item">
                                    <button 
                                        onClick={() => setCurrentPage(currentPage - 1)} 
                                        className="page-link" 
                                        disabled={currentPage === 1}
                                    >
                                       <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                </li>
                                {pageNumbers.map(number => (
                                    <li key={number} className="page-item">
                                        <button onClick={() => setCurrentPage(number)} className="page-link">
                                            {number}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button 
                                        onClick={() => setCurrentPage(currentPage + 1)} 
                                        className="page-link" 
                                        disabled={currentPage === pageNumbers.length}
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin_bv;