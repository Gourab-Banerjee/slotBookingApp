import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import swal from "sweetalert2";
import bcrypt from "bcryptjs";

const LogIn = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({});
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Retrieve the user list from local storage when the component mounts
    const storedUserList = JSON.parse(localStorage.getItem("userList")) || [];
    setUserList(storedUserList);
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    const validationErrors = { ...loginErrors };
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(value)) {
        validationErrors.email = "Email is not valid";
      } else {
        delete validationErrors.email;
      }
    } else if (name === "password") {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (value.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      } else if (!passwordRegex.test(value)) {
        validationErrors.password = "Password is not valid";
      } else {
        delete validationErrors.password;
      }
    }
    setLoginData(() => {
      return {
        ...loginData,
        [name]: value,
      };
    });

    setLoginErrors(validationErrors);
  };

  const handleLogin = (e) => {
    const {email,password}=loginData
    e.preventDefault();
    if (Object.keys(loginErrors).length === 0) {
      // Find the user by email in the userList
      const user = userList.find((user) => user.email === email);

      if (user) {
        // Check if the password matches
        if  (bcrypt.compareSync(password, user.password)) {
          // Login successful
          swal.fire("Login successful!");
          localStorage.setItem("loggedinUserList", JSON.stringify(loginData));
          localStorage.setItem("name", JSON.stringify(user.username));

          navigate("/slotbook");
        } else {
          // Password doesn't match
          alert("Incorrect password");
        }
      } else {
        // User not found
        swal.fire("User not found");
      }
    } else {
      alert("There are validation errors in the form. Please correct them.");
    }
  };

  return (
    <div className="container-box">
      <div className="container">
        <h2>Login Form</h2>

        <form onSubmit={handleLogin}>
          <div className="inputBox">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter Email"
              value={loginData.email}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {loginErrors.email && (
                <span className="error">{loginErrors.email}</span>
              )}
            </div>
          </div>

          <div className="inputBox">
            <input
              type="password"
              name="password"
              required
              placeholder="Enter Password"
              value={loginData.password}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {loginErrors.password && (
                <span className="error">{loginErrors.password}</span>
              )}
            </div>
          </div>

          <button type="submit">Log In</button>
          <div>
            <p>
              Don't have account? <Link to="/signup"> Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
