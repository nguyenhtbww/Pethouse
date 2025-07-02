import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./App.css";

// Đăng ký các thành phần cần thiết cho Chart.js
Chart.register(...registerables);

function AdminTrangChu() {
  const { user, isLoggedIn } = useAuth(); // Lấy trạng thái đăng nhập
  const [productsCount, setProductsCount] = useState(0); // Số lượng sản phẩm
  const [ordersCount, setOrdersCount] = useState(0); // Số lượng đơn hàng
  const [usersCount, setUsersCount] = useState(0); // Số lượng người dùng
  const [orderServicesCount, setOrderServicesCount] = useState(0); // Số lượng dịch vụ đặt

  // Hàm tính toán số lượng đơn hàng theo trạng thái
  const calculateOrderStatusData = (orders) => {
    const statusCounts = {};

    orders.forEach((order) => {
      const status = order.trang_thai; // Giả sử API trả về trường 'trang_thai'
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
      statusCounts[status] += 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    return { labels, data };
  };

  // State cho dữ liệu biểu đồ
  const [orderStatusData, setOrderStatusData] = useState({ labels: [], data: [] });



  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [quarterRevenueData, setQuarterRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy số lượng sản phẩm
        const productsResponse = await fetch("http://127.0.0.1:8000/api/products");
        const productsData = await productsResponse.json();
        setProductsCount(productsData.data.length); // Set số lượng sản phẩm
        console.log("Đếm:", productsData.data.length);  // Kiểm tra phản hồi API




        // Gọi API để lấy số lượng người dùng
        const usersResponse = await fetch("http://127.0.0.1:8000/api/users");
        const usersData = await usersResponse.json();
        setUsersCount(usersData.data.length);

        // Gọi API để lấy số lượng dịch vụ đặt
        const orderServicesResponse = await fetch("http://127.0.0.1:8000/api/orderServices");
        const orderServicesData = await orderServicesResponse.json();
        setOrderServicesCount(orderServicesData.data.length);

        setIsLoading(false); // Dữ liệu đã tải xong
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      try {
        // Gọi API đơn hàng
        const ordersResponse = await fetch("http://127.0.0.1:8000/api/order");
        const ordersData = await ordersResponse.json();
        setOrdersCount(ordersData.data.length);

        console.log("Dữ liệu đơn hàng:", ordersData);  // Kiểm tra dữ liệu API
        setOrders(ordersData.data); // Giả sử API trả về trường `data` chứa danh sách đơn hàng

        // Tính toán doanh thu từ `tong_tien` trong mỗi đơn hàng
        const revenue = calculateRevenue(ordersData.data);
        setRevenueData(revenue);

        // Ví dụ sử dụng hàm tính tổng
        const totalRevenue = calculateTotalRevenue(ordersData.data);
        console.log("Tổng tiền các đơn hàng:", totalRevenue);

        // Tính toán doanh thu theo quý
        const quarterlyRevenue = calculateQuarterlyRevenue(ordersData.data);
        setQuarterRevenueData(quarterlyRevenue);

        // Tính toán doanh thu theo phương thức thanh toán
        const paymentMethodRevenue = calculatePaymentMethodRevenue(ordersData.data);
        setPaymentMethodData(paymentMethodRevenue);

        // Tính toán dữ liệu trạng thái đơn hàng
        const statusData = calculateOrderStatusData(ordersData.data);
        setOrderStatusData(statusData);

        setIsLoading(false); // Dữ liệu đã tải xong
      } catch (error) {
        console.error("Lỗi khi gọi API đơn hàng:", error);
      }
    };


    fetchData();
  }, []);

  // Hàm tính doanh thu từ `tong_tien` trong các đơn hàng
  const calculateRevenue = (orders) => {
    const labels = orders.map(order => `Đơn hàng ${order.ma_don_hang}`);
    const data = orders.map(order => parseFloat(order.tong_tien));

    return { labels, data };
  };

  // Hàm tính doanh thu theo quý
  const calculateQuarterlyRevenue = (orders) => {
    const quarterlyRevenue = [0, 0, 0, 0]; // Quý 1, Quý 2, Quý 3, Quý 4

    orders.forEach(order => {
      const orderDate = new Date(order.ngay_dat); // Ngày đặt hàng
      const month = orderDate.getMonth() + 1; // Lấy tháng (tháng 0-11, cộng thêm 1 để lấy tháng 1-12)
      const revenue = parseFloat(order.tong_tien);

      // Phân loại theo quý
      if (month >= 1 && month <= 3) {
        quarterlyRevenue[0] += revenue; // Quý 1
      } else if (month >= 4 && month <= 6) {
        quarterlyRevenue[1] += revenue; // Quý 2
      } else if (month >= 7 && month <= 9) {
        quarterlyRevenue[2] += revenue; // Quý 3
      } else if (month >= 10 && month <= 12) {
        quarterlyRevenue[3] += revenue; // Quý 4
      }
    });

    return {
      labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
      data: quarterlyRevenue,
    };
  };

  // Dữ liệu cho biểu đồ cột doanh thu
  const barData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Doanh thu đơn hàng",
        backgroundColor: "#3e95cd",
        data: revenueData.data,
      },
    ],
  };

  // Tùy chọn cho biểu đồ cột
  const barOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    legend: { display: true },
    title: {
      display: true,
      text: "Doanh thu từ các đơn hàng",
    },
  };

  // Dữ liệu cho biểu đồ cột doanh thu theo quý
  const quarterlyBarData = {
    labels: quarterRevenueData.labels,
    datasets: [
      {
        label: "Doanh thu theo quý",
        backgroundColor: [
          "#ff6384", // Quý 1
          "#36a2eb", // Quý 2
          "#4bc0c0", // Quý 3
          "#ffcd56", // Quý 4
        ],
        data: quarterRevenueData.data,
      },
    ],
  };

  // Tùy chọn cho biểu đồ cột doanh thu theo quý
  const quarterlyBarOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    legend: { display: true },
    title: {
      display: true,
      text: "Doanh thu theo từng quý",
    },
  };







  const calculatePaymentMethodRevenue = (orders) => {
    const revenueByPaymentMethod = {};

    orders.forEach((order) => {
      const paymentMethod = order.phuong_thuc_tt; // Giả sử trường này lưu phương thức thanh toán
      const revenue = parseFloat(order.tong_tien);

      if (!revenueByPaymentMethod[paymentMethod]) {
        revenueByPaymentMethod[paymentMethod] = 0;
      }
      revenueByPaymentMethod[paymentMethod] += revenue;
    });

    const labels = Object.keys(revenueByPaymentMethod);
    const data = Object.values(revenueByPaymentMethod);

    return { labels, data };
  };

  const [paymentMethodData, setPaymentMethodData] = useState({
    labels: [],
    data: [],
  });

  const pieData = {
    labels: paymentMethodData.labels,
    datasets: [
      {
        data: paymentMethodData.data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF5733"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF5733"]

      },
    ],
  };


  // Tùy chọn cho biểu đồ tròn
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            let value = context.raw;
            label += ": " + value.toLocaleString() + " VNĐ";
            return label;
          },
        },
      },
    },
    title: {
      display: true,
      text: "Doanh thu theo phương thức thanh toán",
    },
  };

  const calculateTotalRevenue = (orders) => {
    return orders.reduce((total, order) => {
      // Cộng dồn tổng tiền của mỗi đơn hàng
      return total + parseFloat(order.tong_tien); // Đảm bảo chuyển đổi thành số thực
    }, 0); // Khởi tạo giá trị tổng là 0
  };

  // Dữ liệu cho biểu đồ tròn thống kê trạng thái đơn hàng
  const orderStatusPieData = {
    labels: orderStatusData.labels,
    datasets: [
      {
        data: orderStatusData.data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF5733"], // Tùy chỉnh màu sắc
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF5733"],
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const orderStatusPieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw;
            return `${label}: ${value} đơn hàng`;
          },
        },
      },
    },
    title: {
      display: true,
      text: "Thống kê đơn hàng theo trạng thái",
    },
  };






  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid admintrangchu">
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
            <Link
              to={"/admin"}
              className="list-group-item list-group-item-action mt-2 mb-0 rounded-0 active"
              aria-current="true"
            >
              <h5 className="mb-0 py-1">Tổng quan</h5>
            </Link>
            <Link
              to={"/adminsanpham"}
              className="list-group-item list-group-item-action my-0  rounded-0"
            >
              <h5 className="mb-0 py-1">Sản phẩm</h5>
            </Link>
            <Link
              to={"/admindichvuchamsoc"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Dịch vụ chăm sóc</h5>
            </Link>
            <Link
              to={"/admindanhmuc"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Danh mục</h5>
            </Link>
            <Link
              to={"/admintaikhoan"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Tài khoản</h5>
            </Link>
            <Link
              to={"/admindonhang"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Đơn hàng</h5>
            </Link>
            <Link
              to={"/admindatlich"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Đặt lịch</h5>
            </Link>
            <Link
              to={"/Admin_BV"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Tin tức</h5>
            </Link>
            <Link
              to={"/adminlienhe"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Liên hệ</h5>
            </Link>
            <Link
              to={"/adminmagiamgia"}
              className="list-group-item list-group-item-action my-0 rounded-0"
            >
              <h5 className="mb-0 py-1">Mã giảm giá</h5>
            </Link>
          </div>
        </div>
        <div className="col-md p-0">
          <nav
            className="navbar navbar-expand-lg bg-primary p-0"
            data-bs-theme="dark"
          >
            <div className="container-fluid">
              <button
                className="btn btn-outline-light me-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#openMenu"
                aria-expanded="false"
                aria-controls="collapseWidthExample"
              >
                <i className="bi bi-list"></i>
              </button>
              <a className="navbar-brand" href="/#">
                PetHouse
              </a>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Xin chào, {user.Hovaten || "Không có tên"}
                    </a>
                    <ul className="dropdown-menu bg-primary p-0 mt-0 border-0 rounded-0">
                      <li className="rounded-0">
                        <Link
                          className="menu-header-top dropdown-item m-0 py-2"
                          to={"/"}
                        >
                          Xem trang chủ
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider m-0" />
                      </li>
                      <li>
                        <a
                          className="menu-header-bottom dropdown-item m-0 py-2"
                          href="/#"
                        >
                          Đăng xuất
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="container">
            <h2 className="my-3">Tổng quan</h2>

            <div className="row">
              {/* Hiển thị các thông tin tổng quan */}
              <div className="col-md-3">
                <div className="card border-primary mb-3">
                  <div className="card-body text-primary">
                    <h5 className="card-title text-center fw-bold">Sản phẩm</h5>
                    <p className="card-text fs-1 text-center">{productsCount}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-success mb-3">
                  <div className="card-body text-success">
                    <h5 className="card-title text-center fw-bold">
                      Tài khoản
                    </h5>
                    <p className="card-text fs-1 text-center">{usersCount}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-warning mb-3">
                  <div className="card-body text-warning">
                    <h5 className="card-title text-center fw-bold">Đơn hàng</h5>
                    <p className="card-text fs-1 text-center">{ordersCount}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-danger mb-3">
                  <div className="card-body text-danger">
                    <h5 className="card-title text-center fw-bold">Tổng doanh thu</h5>
                    <p className="card-text fs-1 text-center">
                      {new Intl.NumberFormat({
                        style: 'currency',
                        currency: 'VND'
                      }).format(calculateTotalRevenue(orders))}
                    </p>

                  </div>
                </div>
              </div>
            </div>



            <div className="d-flex flex-wrap border border-dark rounded-3 my-3 p-2">
              <div className="d-flex flex-wrap border border-dark rounded-3 my-3 p-2">
                <div className="row col-md-12 border-bottom py-2">
                  <div
                    className="col-md-6 d-flex align-items-center justify-content-center"
                    style={{ height: "100%" }}
                  >
                    {/* Biểu đồ cột doanh thu từ các đơn hàng */}
                    <Bar data={barData} options={barOptions} />
                  </div>

                  <div
                    className="col-md-6 d-flex align-items-center justify-content-center border-start border-2"
                    style={{ height: "100%" }}
                  >
                    {/* Biểu đồ cột doanh thu theo quý */}
                    <Bar data={quarterlyBarData} options={quarterlyBarOptions} />
                  </div>
                </div>

                <div className="row col-md-12 border-bottom py-2" style={{ height: "70%" }}>
                  <div
                    className="col-md-6 d-flex align-items-center justify-content-center"
                    style={{ height: "80%" }}
                  >

                    {/* Biểu đồ cột doanh thu từ các đơn hàng */}

                    <Pie data={pieData} options={pieOptions} />
                  </div>

                  <div
                    className="col-md-6 d-flex align-items-center justify-content-center border-start border-2"
                    style={{ height: "80%" }}
                  >
                    {/* Biểu đồ cột doanh thu theo quý */}
                    <Pie data={orderStatusPieData} options={orderStatusPieOptions} />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <h3>Thống kê doanh thu</h3>
              </div>
              <div className="col-md-12"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTrangChu;
