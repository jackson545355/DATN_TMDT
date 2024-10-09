import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      console.log(credentials)
      const response = await axios.post('http://localhost:3009/admin/login', credentials);
      const { token } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem('token', token);

      // Giả định bạn muốn lấy thông tin user từ token hoặc lưu tên user (có thể thay đổi cách xử lý tùy vào server trả về)
      setUser({ name: credentials.username });
    } catch (error) {
      alert('Login failed', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
