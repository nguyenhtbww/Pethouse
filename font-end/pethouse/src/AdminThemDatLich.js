import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

function AdminThemDatLich() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State for API data
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);

    // State for form inputs
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [note, setNote] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");

    // Fetch users and services on component mount
    useEffect(() => {
        // Fetch users
        fetch("http://127.0.0.1:8000/api/users")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success" && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    console.error("Invalid users data format:", data);
                    setUsers([]);
                }
            })
            .catch((error) => console.error("Error fetching users:", error));

        // Fetch services
        fetch("http://127.0.0.1:8000/api/services")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success" && Array.isArray(data.data)) {
                    setServices(data.data);
                } else {
                    console.error("Invalid services data format:", data);
                    setServices([]);
                }
            })
            .catch((error) => console.error("Error fetching services:", error));
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUser || selectedServices.length === 0 || !deliveryDate) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const payload = {
            Mataikhoan: selectedUser,
            GhiChu: note,
            NgayGiao: deliveryDate,
            chi_tiet: selectedServices.map((service) => ({
                MaSP: service.ma_dich_vu,
                SoLuong: 1, // Default quantity to 1; adjust as needed.
            })),
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/orderServices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Thêm đơn thành công!");
                navigate("/admindatlich");
            } else {
                const errorData = await response.json();
                console.error("Error adding order:", errorData);
                alert("Thêm đơn thất bại!");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("Thêm đơn thất bại!");
        }
    };

    // Handle selecting a service
    const handleServiceSelection = (service) => {
        setSelectedServices((prevServices) => {
            const exists = prevServices.find((s) => s.ma_dich_vu === service.ma_dich_vu);
            if (exists) {
                return prevServices.filter((s) => s.ma_dich_vu !== service.ma_dich_vu);
            } else {
                return [...prevServices, service];
            }
        });
    };

    // Handle date change
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        // Check if there's already a time value and append it to the new date
        const currentTime = deliveryDate ? deliveryDate.split('T')[1] : '07:00'; // Default time
        setDeliveryDate(newDate + 'T' + currentTime + ':00');
    };

    // Handle time change
    const handleTimeChange = (e) => {
        const currentDate = deliveryDate ? deliveryDate.split('T')[0] : ''; // Get current date if available
        const newTime = e.target.value;
        setDeliveryDate(currentDate + 'T' + newTime + ':00');
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div
                    id="openMenu"
                    className="col-md-2 p-0 bg-primary collapse collapse-horizontal show"
                    style={{ minHeight: "100vh" }}
                >
                    <Link to={"/"}>
                        <img
                            src={`http://localhost:8000/image/Nen_trong_suot.png`}
                            className="d-block w-75 mx-auto"
                            alt="Logo"
                        />
                    </Link>
                    <div className="list-group list-group-item-primary">
                        <Link to={"/admin"} className="list-group-item list-group-item-action mt-2 mb-0 rounded-0" aria-current="true">
                            <h5 className="mb-0 py-1">Tổng quan</h5>
                        </Link>
                        <Link to={"/adminsanpham"} className="list-group-item list-group-item-action my-0  rounded-0">
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
                        <Link to={"/admindatlich"} className="list-group-item list-group-item-action my-0 rounded-0 active">
                            <h5 className="mb-0 py-1">Đặt lịch</h5>
                        </Link>
                        <Link to={"/Admin_BV"} className="list-group-item list-group-item-action my-0 rounded-0">
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

                {/* Main Content */}
                <div className="col-md p-0">
                    <nav className="navbar navbar-expand-lg bg-primary p-0" data-bs-theme="dark">
                        <div className="container-fluid">
                            <button className="btn btn-outline-light me-3" type="button" data-bs-toggle="collapse" data-bs-target="#openMenu">
                                <i className="bi bi-list"></i>
                            </button>
                            <a className="navbar-brand" href="/#">
                                PetHouse
                            </a>
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/#" role="button" data-bs-toggle="dropdown">
                                        Xin chào, {user.Hovaten || "Không có tên"}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <div className="p-4">
                        <h2>Thêm đơn đặt lịch</h2>
                        <form onSubmit={handleSubmit} className="col-md-12 border border-dark rounded-3 my-3 p-2">
                            <div className="mb-3">
                                <label className="form-label">Chọn tài khoản</label>
                                <select
                                    className="form-select"
                                    value={selectedUser || ""}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                >
                                    <option value="">Chọn tài khoản</option>
                                    {users.map((user) => (
                                        <option key={user.ma_tai_khoan} value={user.ma_tai_khoan}>
                                            {user.ten_tai_khoan}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Chọn dịch vụ</label>
                                <div className="d-flex flex-wrap">
                                    {services.map((service) => (
                                        <div key={service.ma_dich_vu} className="form-check me-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`service-${service.ma_dich_vu}`}
                                                onChange={() => handleServiceSelection(service)}
                                            />
                                            <label className="form-check-label" htmlFor={`service-${service.ma_dich_vu}`}>
                                                {service.ten_dich_vu} ({service.gia} VND)
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Ghi chú</label>
                                <textarea
                                    className="form-control"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Giờ</label>
                                <div className="d-flex">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={deliveryDate.split('T')[0] || ""} // Chỉ lấy phần ngày nếu có
                                        onChange={handleDateChange}
                                    />
                                    <select
                                        className="form-control ms-2"
                                        value={deliveryDate.split('T')[1] ? deliveryDate.split('T')[1].substring(0, 5) : '07:00'}
                                        onChange={handleTimeChange}
                                    >
                                        {Array.from({ length: 12 }, (_, index) => {
                                            const hour = 7 + index;
                                            if (hour === 12) return null;
                                            return (
                                                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                                    {`${hour}:00`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Thêm đơn
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminThemDatLich;
