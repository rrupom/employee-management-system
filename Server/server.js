import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { verify } from "crypto";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "POST"],
    credentials: true,
  })
);
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

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not autheticated" });
  } else {
    jwt.verify(token, "rakib-cse", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token Wrong" });
      } else {
        req.role = decoded.role;
        req.id = decoded.id;
        next();
      }
    });
  }
};

app.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ Status: "Success", role: req.role, id: req.id });
});

app.get("/adminCount", (req, res) => {
  const sql = "SELECT count(id) as admin from users";
  connection.query(sql, (error, result) => {
    if (error) {
      return res.json({ Error: "Error in running query" });
    } else {
      res.json(result);
    }
  });
});

app.get("/employeeCount", (req, res) => {
  const sql = "SELECT count(id) as employee from addemployee";
  connection.query(sql, (error, result) => {
    if (error) {
      return res.json({ Error: "Error in running query" });
    } else {
      res.json(result);
    }
  });
});

app.get("/salaryCount", (req, res) => {
  const sql = "SELECT sum(salary) as SumOfSalary from addemployee";
  connection.query(sql, (error, result) => {
    if (error) {
      return res.json({ Error: "Error in running query" });
    } else {
      res.json(result);
    }
  });
});

app.post("/employeeLogin", (req, res) => {
  const sql = "SELECT * FROM addemployee WHERE email = ?";
  connection.query(sql, [req.body.email], (error, result) => {
    if (error) {
      return res.json({ Status: "Error", Error: "Error in running query" });
    }
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (error, response) => {
          if (response) {
            // const id = result[0].id;
            const token = jwt.sign(
              { role: "employee", id: result[0].id },
              "rakib-cse",
              {
                expiresIn: "1d",
              }
            );
            res.cookie("emptoken", token);
            return res.json({ Status: "Success", id: result[0].id });
          } else {
            return res.json({ Error: "Password Error" });
          }
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users where email = ? AND password = ?";
  connection.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.json({ Status: "Error", Error: "Error in running query" });
    }
    if (result.length > 0) {
      // const id = result[0].id;
      const token = jwt.sign({ role: "admin" }, "rakib-cse", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM addemployee WHERE id = ?";
  connection.query(sql, [id], (error, result) => {
    if (error) {
      return res.json({ Error: "Error in getting employee" });
    } else {
      return res.json({ Status: "Success", Result: result });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
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
