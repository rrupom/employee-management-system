import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  const [adminCount, setAdminCount] = useState();
  const [employeeCount, setEmployeeCount] = useState();
  const [totalSalary, setTotalSalary] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:8080/adminCount")
      .then((res) => {
        // console.log(res);
        setAdminCount(res.data[0].admin);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("http://localhost:8080/employeeCount")
      .then((res) => {
        // console.log(res);
        setEmployeeCount(res.data[0].employee);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:8080/salaryCount")
      .then((res) => {
        // console.log(res);
        setTotalSalary(res.data[0].SumOfSalary);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <div className="p-3 d-flex justify-content-around">
        <div className="p-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div className="">
            <h5>Total: {adminCount}</h5>
          </div>
        </div>
        <div className="p-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div className="">
            <h5>Total: {employeeCount}</h5>
          </div>
        </div>
        <div className="p-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Salary</h4>
          </div>
          <hr />
          <div className="">
            <h5>Total: {totalSalary}</h5>
          </div>
        </div>
      </div>
      {/* {List of admini} */}
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admin</td>
              <td>Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
