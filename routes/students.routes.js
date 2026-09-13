const express = require("express");

const router = express.Router();
const {
  createStudent,
  getStudents,
  updateStudent,
  getStudentById,
  getStudentsByName,
  deleteStudent,
  searchStudents,
  updateStudentCourse,
} = require("../controllers/students.controllers");

router.post("/create-students", createStudent);
router.get("/get-students", getStudents);
router.get("/get-students/:id", getStudentById);
router.get("/get-students-by-name", getStudentsByName);
router.put("/update-students/:id", updateStudent);
router.delete("/delete-students/:id", deleteStudent);
router.get("/search-students", searchStudents);
router.patch("/update-student-course/:id", updateStudentCourse);

module.exports = router;
