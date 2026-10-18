const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./student");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Student Management Backend is running");
});
app.post("/students", async (req, res) => {
    try {
        const lastStudent = await Student.findOne().sort({ id: -1 });
        const newId = lastStudent ? lastStudent.id + 1 : 1;
        const student = await Student.create({
            id: newId,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            course: req.body.course
        });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({
            message: "Error creating student",
            error: error.message
        });
    }
});
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Error getting students",
            error: error.message
        });
    }
});
app.get("/students/search", async (req, res) => {
    try {
        const student = await Student.findOne({
            name: req.query.name,
            email: req.query.email
        });
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Error searching student",
            error: error.message
        });
    }
});
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findOne({
            id: Number(req.params.id)
        });
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Error getting student",
            error: error.message
        });
    }
});
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            {
                id: Number(req.params.id)
            },
            {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                course: req.body.course
            },
            {
                new: true
            }
        );
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });
    }
});
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            id: Number(req.params.id)
        });
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        res.json({
            message: "Student deleted successfully",
            student: student
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});
mongoose
    .connect("mongodb://127.0.0.1:27017/todoDB")
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(5000, () => {
            console.log("Server running at http://localhost:5000");
            console.log("Students API: http://localhost:5000/students");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:");
        console.log(error);
    });