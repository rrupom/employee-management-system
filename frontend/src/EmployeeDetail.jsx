import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee/" + id)
      .then((res) => {
        console.log(res);
        setEmployee(res.data.Result[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8080/logout")
      .then((res) => {
        // console.log(res);
        navigate("/start");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="d-flex justify-content-center flex-column align-items-center mt-3">
        <img
          src={`http://localhost:8080/images/` + employee.image}
          alt="Employee Image"
          className="empImg"
        />
        <div className="d-flex align-items-center flex-column mt-5">
          <h3>Name: {employee.name}</h3>
          <h3>Email: {employee.email}</h3>
          <h3>Salary: {employee.salary}</h3>
        </div>
        <div className="my-4">
          <button className="btn btn-primary me-2 btn-lg">Edit</button>
          <button className="btn btn-danger me-2 btn-lg" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
