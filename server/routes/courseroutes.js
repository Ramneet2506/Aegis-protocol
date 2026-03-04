const express = require("express");
const Course = require("../models/course");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

// Faculty creates course
router.post("/", protect, authorizeRoles("faculty", "admin"), async (req, res) => {
    try {
        const { title, description } = req.body;

        const course = await Course.create({
            title,
            description,
            faculty: req.user._id
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add resource to course
router.post("/:id/resource", protect, authorizeRoles("faculty", "admin"), async (req, res) => {
    try {
        const { title, link } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: "Course not found" });

        course.resources.push({ title, link });
        await course.save();

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Add announcement to course
router.post(
  "/:id/announcement",
  protect,
  authorizeRoles("faculty", "admin"),
  async (req, res) => {
    try {
      const { title, message } = req.body;

      const course = await Course.findById(req.params.id);

      course.announcements.push({
        title,
        message,
      });

      await course.save();

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Unenroll from course
router.post("/:id/unenroll", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    course.enrolledStudents = course.enrolledStudents.filter(
      (student) => student.toString() !== req.user._id.toString()
    );

    await course.save();

    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Student enroll
router.post("/:id/enroll", protect, authorizeRoles("student"), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: "Course not found" });

        if (!course.enrolledStudents.includes(req.user._id)) {
            course.enrolledStudents.push(req.user._id);
            await course.save();
        }

        res.json({ message: "Enrolled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// View all courses
router.get("/", protect, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("faculty", "name")
      .populate("enrolledStudents", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Course Analytics
router.get("/analytics", protect, authorizeRoles("faculty", "admin"), async (req, res) => {
  try {
    const courses = await Course.find().populate("enrolledStudents");

    const totalCourses = courses.length;

    let totalStudents = 0;
    let mostPopularCourse = null;
    let maxEnrollment = 0;

    courses.forEach((course) => {
      const enrolledCount = course.enrolledStudents.length;

      totalStudents += enrolledCount;

      if (enrolledCount > maxEnrollment) {
        maxEnrollment = enrolledCount;
        mostPopularCourse = course.title;
      }
    });

    const averageEnrollment =
      totalCourses > 0 ? (totalStudents / totalCourses).toFixed(2) : 0;

    res.json({
      totalCourses,
      totalStudents,
      mostPopularCourse,
      averageEnrollment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;