import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

connection.connect(function (err) {
  if (err) {
    console.log("err connection", err.stack);
  } else {
    console.log("connected as id ", connection.threadId);
  }
});

app.get("/getEmployees", (req, res) => {
  const sql = "SELECT * FROM addemployee";
  connection.query(sql, (err, result) => {
    if (err) {
      return res.json({ Error: "Error in getting employees" });
    } else {
      return res.json({ Status: "Success", Result: result });
    }
  });
});

app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const sql = "SELECT * FROM addemployee WHERE id = ?";
  connection.query(sql, [id], (error, result) => {
    if (error) {
      return res.json({ Error: "Getting employee failed" });
    }
    return res.json({ Status: "Success", Result: result });
  });
});

app.put("/update/:id", (req, res) => {
  // console.log(req.body);
  const id = req.params.id;
  const sql = "UPDATE addemployee SET salary = ? WHERE id = ?";
  connection.query(sql, [req.body.salary, id], (error, result) => {
    if (error) {
      return res.json({ Error: "Error occured while updating employee" });
    }
    return res.json({ Status: "Success", Result: result });
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const sql = "DELETE FROM addemployee WHERE id = ?";
  connection.query(sql, [id], (error, result) => {
    if (error) {
      res.json({ Error: "Error deleting employee" });
    }
    return res.json({ Status: "Success", Result: result });
  });
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

app.post("/create", upload.single("image"), (req, res) => {
  //   console.log(req.body);
  const sql =
    "INSERT INTO addemployee (`name`,`email`,`password`,`salary`,`address`,`image`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), 10, function (err, hash) {
    if (err) {
      return res.json({ Error: "Error in hashing password" });
    }

    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.salary,
      req.body.address,
      req.file.filename,
    ];

    connection.query(sql, [values], function (err, result) {
      if (err) {
        return res.json({ Error: "Inside empolyee add query" });
      }
      return res.json({ Success: "Success" });
    });
  });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
