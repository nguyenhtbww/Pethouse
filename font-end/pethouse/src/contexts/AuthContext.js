import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Trạng thái lưu thông tin người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Kiểm tra xem có thông tin người dùng trong sessionStorage hay không khi component được render
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Chuyển đổi từ JSON về đối tượng
      setUser(parsedUser); // Cập nhật thông tin người dùng vào state
      setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
    }
  }, []);

  // Hàm đăng nhập
  const login = (userData) => {
    try {
      // Lưu thông tin người dùng vào state và sessionStorage
      setUser(userData);
      setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
      sessionStorage.setItem("user", JSON.stringify(userData)); // Lưu vào sessionStorage
      console.log("Thông tin người dùng:", userData);
      console.log("Thông tin trong sessionStorage:", sessionStorage.getItem("user"));
    } catch (error) {
      setError("Đăng nhập không thành công");
      console.error("Lỗi đăng nhập:", error);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("user"); // Xóa thông tin người dùng khỏi sessionStorage
    console.log("Người dùng đã đăng xuất");
  };

  // Kiểm tra quyền của người dùng
  const hasPermission = (permission) => {
    return user && user.Quyen === permission; // Kiểm tra quyền của người dùng
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,  // Cung cấp setUser
        login,
        logout,
        isLoggedIn,
        error,
        setError,
        setIsLoggedIn,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext trong các component khác
export const useAuth = () => {
  return useContext(AuthContext);
};
