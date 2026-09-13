const Student = require("../models/students.models");
const mongoose = require('mongoose');

const createStudent = async (req, res) => {
  const { name, age, email, phone, address, course, institution } = req.body;

  try {
    const student = new Student({
      name,
      age,
      email,
      phone,
      address,
      course,
      institution,
    });

    await student.save();

    return res.status(201).json({
      message: "Student created Successfully",
    });
  } catch (error) {
        console.error(error);

        // Duplicate email
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        // Required field validation
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Name and email are required',
                error: error.message
            });
        }
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return res
      .status(200)
      .json({ message: "Students fetched successfully", students });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age, email, phone, address, course, institution } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      id,
      {
        name,
        age,
        email,
        phone,
        address,
        course,
        institution,
      },
      { new: true },
    );

    {
      returnDocument: "after";
    }
    return res
      .status(200)
      .json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid student ID'
        });
    }
  try {
    const student = await Student.findById(id);
    return res
      .status(200)
      .json({ message: "Student fetched successfully", student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentsByName = async (req, res) => {
  const { name } = req.query;

  try {
    const students = await Student.find({ name });
    return res
      .status(200)
      .json({ message: "Students fetched successfully", students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid student ID'
        });
    }

    try {
        const student = await Student.findByIdAndDelete(id);

        // A valid ID does not guarantee that the student exists.
        if (!student) {
            return res.status(404).json({
                message: 'Student not found or already deleted'
            });
        }
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const searchStudents = async (req, res) => {
    const { q } = req.query;

    // Check if q is missing or empty
    if (!q || q.trim() === '') {
        return res.status(400).json({
            message: 'Search query (q) is required'
        });
    }

    try {
        const students = await Student.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { course: { $regex: q, $options: 'i' } }
            ]
        });

        return res.status(200).json(students);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


const updateStudentCourse = async (req, res) => {
    const { id } = req.params;
    const { course } = req.body;

    // Check if course is missing or empty
    if (!course || course.trim() === '') {
        return res.status(400).json({
            message: 'Course is required'
        });
    }

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid student ID'
        });
    }

    try {
        const student = await Student.findByIdAndUpdate(
            id,
            { course: course },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        return res.status(200).json({
            message: 'Course updated successfully',
            student
        });

    } catch (error) {
        console.error(error);

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Invalid course',
                error: error.message
            });
        }

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};




module.exports = {
  createStudent,
  getStudents,
  updateStudent,
  getStudentById,
  getStudentsByName,
  deleteStudent,
  searchStudents,
  updateStudentCourse,
};
