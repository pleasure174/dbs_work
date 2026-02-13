const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tvet_system"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/", (req, res) => {
  res.json({
    message: "TVET Student Course Registration API is running"
  });
});

app.post("/students", (req, res) => {
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO students (full_name, email) VALUES (?, ?)";
  db.query(sql, [full_name, email], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Student registered successfully" });
  });
});

app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "UPDATE students SET full_name = ?, email = ? WHERE id = ?";
  db.query(sql, [full_name, email, id], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Student updated successfully" });
  });
});

app.post("/courses", (req, res) => {
  const { course_name, course_code } = req.body;

  if (!course_name || !course_code) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO courses (course_name, course_code) VALUES (?, ?)";
  db.query(sql, [course_name, course_code], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Course added successfully" });
  });
});

app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put("/courses/:id", (req, res) => {
  const { id } = req.params;
  const { course_name, course_code } = req.body;

  if (!course_name || !course_code) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "UPDATE courses SET course_name = ?, course_code = ? WHERE id = ?";
  db.query(sql, [course_name, course_code, id], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Course updated successfully" });
  });
});

app.post("/enrollments", (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)";
  db.query(sql, [student_id, course_id], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Student enrolled successfully" });
  });
});

app.get("/enrollments", (req, res) => {
  const sql = `
    SELECT 
      students.full_name AS student,
      courses.course_name AS course
    FROM enrollments
    JOIN students ON enrollments.student_id = students.id
    JOIN courses ON enrollments.course_id = courses.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Student deleted successfully" });
  });
});

app.delete("/courses/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM courses WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Course deleted successfully" });
  });
});

app.delete("/enrollments/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM enrollments WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Enrollment deleted successfully" });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

