import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: formData.username, password: formData.password }), // Sử dụng username thay vì email
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const signup = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state === "Login" ? "Đăng nhập" : "Đăng ký"}</h1>
        <div className="loginsignup-fields">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={changeHandler}
          />
          {state === "Sign Up" && (
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.email}
              onChange={changeHandler}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
          />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup(); }}>{state === "Login" ? "Đăng nhập" : "Đăng ký"}</button>

        {state === "Login" ? (
          <p className="loginsignup-login">
            Bạn mới biết đến MEGA? <span onClick={() => { setState("Sign Up"); }}>  Đăng ký</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Bạn đã có tài khoản? <span onClick={() => { setState("Login"); }}>Đăng nhập ngay</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;