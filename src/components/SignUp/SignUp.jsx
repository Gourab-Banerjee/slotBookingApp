import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import swal from "sweetalert2";
import bcrypt from "bcryptjs";

// const salt = bcrypt.genSaltSync(10);

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Retrieve the user list from local storage when the component mounts
    const storedUserList = JSON.parse(localStorage.getItem("userList")) || [];
    setUserList(storedUserList);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const validationErrors = { ...errors };

    if (name === "username") {
      const namePattern = /^[a-zA-Z\s]+$/;
      // Only alphabetic characters and spaces allowed
      if (value.length < 3) {
        validationErrors.username = "Username must be at least 3 characters";
      } else if (!namePattern.test(value)) {
        validationErrors.username =
          "Name should only contain alphabetic characters";
      } else {
        delete validationErrors.username;
      }
    } else if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(value)) {
        validationErrors.email = "Email is not valid";
      } else {
        // Check if the email already exists in the user list
        const emailExists = userList.some((user) => user.email === value);
        if (emailExists) {
          validationErrors.email = "Email already exists";
        } else {
          delete validationErrors.email;
        }
      }
    } else if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      const numberRegex = /^[0-9]+$/;
      const phoneNoRegex = /^[6-9]\d{9}$/;

      if (!numberRegex.test(value)) {
        validationErrors.phone =
          "phone number should only contain neumerical characters";
      } else if (!phoneNoRegex.test(value)) {
        validationErrors.phone = "phone number is not valid";
      } else if (!phoneRegex.test(value)) {
        validationErrors.phone = "phone number should contain exactly 10 digit";
      } else {
        delete validationErrors.phone;
      }
    } else if (name === "password") {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (value.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      } else if (!passwordRegex.test(value)) {
        validationErrors.password =
          "Password should contain one digit, one lowercase, one uppercase";
      } else {
        delete validationErrors.password;
      }
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        validationErrors.confirmPassword = "Passwords do not match";
      } else {
        delete validationErrors.confirmPassword;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors(validationErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there are any validation errors
    if (Object.keys(errors).length === 0) {
      const password = formData.password;
      const hashedPassword = bcrypt.hashSync(
        password,
        "$2a$10$CwTycUXWue0Thq9StjUM0u"
      );
      // formData.password=hashedPassword

      const newUserList = [
        ...userList,
        {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: hashedPassword,
        },
      ];
      const newUsername = formData.username;

      // Save the updated user list to local storage
      localStorage.setItem("userList", JSON.stringify(newUserList));
      localStorage.setItem("name", JSON.stringify(newUsername));

      // Update the state with the new user list
      setUserList(newUserList);

      // Reset the form data
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      swal.fire("Signup successfull");
      navigate("/slotbook");
    } else {
      // If there are errors, you can display a general error message or take other actions
      alert("There are validation errors in the form. Please correct them.");
    }
  };

  return (
    <div className="container-box">
      <div className="container">
        <h2>Signup Form</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            {/* <label>Username:</label> */}
            <input
              type="text"
              name="username"
              placeholder="Enter  Name"
              required
              value={formData.username}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>
          </div>

          <div className="inputBox">
            {/* <label>Email:</label> */}
            <input
              type="email"
              name="email"
              placeholder="Enter  Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>

          <div className="inputBox">
            {/* <label>Phone:</label> */}
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </div>

          <div className="inputBox">
            {/* <label>Password:</label> */}
            <input
              type="password"
              name="password"
              placeholder="Enter  Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </div>

          <div className="inputBox">
            {/* <label>Confirm Password:</label> */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <br />
            <div className="error-container">
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit">Sign Up</button>
          <div>
            <p>
              Do you have account? <Link to="/"> Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
