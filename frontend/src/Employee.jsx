import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Employee(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/getEmployees")
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data.Result);
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete("http://localhost:8080/delete/" + id).then((response) => {
      if (response.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error deleting user");
      }
    });
  };

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/create" className="btn btn-success mb-5">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>{employee.salary}</td>
                  <td>
                    {
                      <img
                        src={`http://localhost:8080/images/` + employee.image}
                        alt="profile image"
                        className="employee_image"
                      />
                    }
                  </td>
                  <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      className="btn btn-success mx-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employee;
