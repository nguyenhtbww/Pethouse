import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext"; // Nhập AuthContext
import "../App.css";

const LoginSignupForm = () => {
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const { login, setIsLoggedIn } = useAuth(); // Lấy hàm login và setIsLoggedIn từ AuthContext

  // Formik cho Đăng Ký
  const signupFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số"
        )
        .required("Vui lòng nhập mật khẩu"),
      phone: Yup.string()
        .matches(
          /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          "Vui lòng nhập đúng số điện thoại"
        )
        .required("Vui lòng nhập số điện thoại"),
      address: Yup.string().required("Vui lòng nhập địa chỉ"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dangki", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Hovaten: values.name,
            Email: values.email,
            Matkhau: values.password,
            SDT: values.phone,
            DiaChi: values.address,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (
            response.status === 400 &&
            errorData.message === "Email đã tồn tại"
          ) {
            setFieldError("email", "Email đã tồn tại");
          } else {
            throw new Error(errorData.message || "Đăng ký thất bại");
          }
        }

        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        setIsRightPanelActive(false);
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formik cho Đăng Nhập
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dangnhap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Email: values.email,
            Matkhau: values.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Đăng nhập thất bại");
        }

        const data = await response.json(); // Lấy dữ liệu từ phản hồi
        const userData = data.user; // Truy cập vào đối tượng user

        // Kiểm tra dữ liệu người dùng và lưu vào sessionStorage
        if (userData) {
          const userInfo = {
            Mataikhoan: userData.Mataikhoan || null,
            Hovaten: userData.Hovaten || null,
            SDT: userData.SDT || null,
            Diachi: userData.DiaChi || null,
            Email: userData.Email || null,
          };

          sessionStorage.setItem("user", JSON.stringify(userInfo));
          console.log("Thông tin người dùng được lưu vào sessionStorage:", userInfo);

          // Gọi hàm login và cập nhật trạng thái đăng nhập
          login(userData);  // Gọi hàm login trong AuthContext
          setIsLoggedIn(true); // Cập nhật trạng thái đã đăng nhập trong AuthContext
          alert("Đăng nhập thành công!");

          navigate("/"); // Chuyển hướng đến trang Admin
        } else {
          throw new Error("Thông tin người dùng không hợp lệ.");
        }
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="lg">
      <div className={`login ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        {/* Form Đăng Ký */}
        <div className="form-login sign-up-login">
          <form onSubmit={signupFormik.handleSubmit}>
            <h1 className="fw-bold mt-4">Tạo tài khoản</h1>
            <input
              type="text"
              placeholder="Tên"
              {...signupFormik.getFieldProps("name")}
              required
            />
            {signupFormik.touched.name && signupFormik.errors.name && (
              <div className="text-danger">{signupFormik.errors.name}</div>
            )}
            <input
              type="email"
              placeholder="Email"
              {...signupFormik.getFieldProps("email")}
              required
            />
            {signupFormik.touched.email && signupFormik.errors.email && (
              <div className="text-danger">{signupFormik.errors.email}</div>
            )}
            <input
              type="password"
              placeholder="Mật khẩu"
              {...signupFormik.getFieldProps("password")}
              required
            />
            {signupFormik.touched.password && signupFormik.errors.password && (
              <div className="text-danger">{signupFormik.errors.password}</div>
            )}
            <input
              type="text"
              placeholder="Số điện thoại"
              {...signupFormik.getFieldProps("phone")}
              required
            />
            {signupFormik.touched.phone && signupFormik.errors.phone && (
              <div className="text-danger">{signupFormik.errors.phone}</div>
            )}
            <input
              type="text"
              placeholder="Địa chỉ"
              {...signupFormik.getFieldProps("address")}
              required
            />
            {signupFormik.touched.address && signupFormik.errors.address && (
              <div className="text-danger">{signupFormik.errors.address}</div>
            )}
            <button
              className="mt-4 rounded"
              type="submit"
              disabled={signupFormik.isSubmitting}
            >
              Đăng Ký
            </button>
            {signupFormik.errors.general && (
              <p className="my-3 text-danger">{signupFormik.errors.general}</p>
            )}
          </form>
        </div>

        {/* Form Đăng Nhập */}
        <div className="form-login sign-in-login">
          <form onSubmit={loginFormik.handleSubmit}>
            <h1 className="fw-bold mb-4">Đăng Nhập</h1>
            <input
              type="email"
              placeholder="Email"
              {...loginFormik.getFieldProps("email")}
              required
            />
            {loginFormik.touched.email && loginFormik.errors.email && (
              <div className="text-danger">{loginFormik.errors.email}</div>
            )}
            <input
              type="password"
              placeholder="Mật khẩu"
              {...loginFormik.getFieldProps("password")}
              required
            />
            {loginFormik.touched.password && loginFormik.errors.password && (
              <div className="text-danger">{loginFormik.errors.password}</div>
            )}
            <Link className="text-nowrap" to="/Password">Quên mật khẩu?</Link>
            <br />
            <button
              className="mt-4 rounded"
              type="submit"
              disabled={loginFormik.isSubmitting}
            >
              Đăng Nhập
            </button>
            {loginFormik.errors.general && (
              <p className="my-3 text-danger">{loginFormik.errors.general}</p>
            )}
          </form>
        </div>

        <div className="overlay-login">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="fw-bold">Chào Mừng Trở Lại!</h1>
              <p>Để kết nối với chúng tôi, vui lòng đăng nhập với thông tin cá nhân của bạn</p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => setIsRightPanelActive(false)}
              >
                Đăng Nhập
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="fw-bold">Chào Mừng Bạn!</h1>
              <p>Hãy bắt đầu với tài khoản mới của bạn</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => setIsRightPanelActive(true)}
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
