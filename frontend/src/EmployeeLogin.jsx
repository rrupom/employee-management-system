import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function EmployeeLogin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/employeeLogin", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          const id = res.data.id;
          navigate("/employeeDetail/" + id);
        } else {
          setError(res.data.Error);
        }
      })
      .then((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-danger">{error && error}</div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              className="form-control rounded-0"
              autoComplete="off"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Log in
          </button>
          <p>You are agree to our terms and policies</p>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;
