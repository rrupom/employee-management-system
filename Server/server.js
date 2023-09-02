import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

connection.connect(function (err) {
  if (err) {
    console.log("err connection", err.stack);
  } else {
    console.log("connected as id ", connection.threadId);
  }
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users where email = ? AND password = ?";
  connection.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.json({ Status: "Error", Error: "Error in running query" });
    }
    if (result.length > 0) {
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
