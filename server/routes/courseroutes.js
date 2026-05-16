const express = require("express");
const Course = require("../models/course");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");
const requireOwnership = require("../middleware/requireownership");
const { validateCourse, handleValidationErrors } = require("../middleware/validation");
const checkCourseAccess = require("../middleware/courseOwnership");
const router = express.Router();

// Faculty creates course
router.post(
  "/",
  protect,
  authorizeRoles("faculty", "admin"),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      const course = await Course.create({
        title,
        description,
        createdBy: req.user._id,
      });

      res.status(201).json({
        success: true,
        data: course,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// View all courses
router.get("/", protect, async (req, res) => {
  try {

    let query = {};

    // FACULTY -> only own courses
    if (req.user.role === "faculty") {
      query.createdBy = req.user._id;
    }

    const courses = await Course.find(query)
      .populate("createdBy", "name email")
      .populate("enrolledStudents", "name email");

    res.json({
      success: true,
      data: courses,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get single course
router.get("/:id", protect, checkCourseAccess, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("enrolledStudents", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
});

// Update course (ownership required)
router.put("/:id", protect, authorizeRoles("faculty", "admin"), checkCourseAccess, validateCourse, handleValidationErrors, async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    next(error);
  }
});

// Delete course (ownership required)
router.delete("/:id", protect, authorizeRoles("faculty", "admin"), checkCourseAccess, async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Add resource to course (ownership required)
router.post("/:id/resource", protect, authorizeRoles("faculty", "admin"), checkCourseAccess, async (req, res, next) => {
    try {
        const { title, link } = req.body;

        if (!title || !link) {
            return res.status(400).json({
                success: false,
                message: "Title and link are required"
            });
        }

        const course = req.resource; // From requireOwnership middleware

        course.resources.push({ title, link });
        await course.save();

        res.json({
            success: true,
            message: "Resource added successfully",
            data: course
        });
    } catch (error) {
        next(error);
    }
});

// Add announcement to course (ownership required)
router.post(
  "/:id/announcement",
  protect,
  authorizeRoles("faculty", "admin"),
  checkCourseAccess,
  async (req, res, next) => {
    try {
      const { title, message } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: "Title and message are required"
        });
      }

      const course = req.resource;

      course.announcements.push({
        title,
        message,
      });

      await course.save();

      res.json({
        success: true,
        message: "Announcement added successfully",
        data: course
      });
    } catch (error) {
      next(error);
    }
  }
);

// Student enroll in course
router.post("/:id/enroll", protect, authorizeRoles("student"), async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const alreadyEnrolled = course.enrolledStudents.some(
  (studentId) =>
    studentId.toString() === req.user._id.toString()
);

if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled in this course"
            });
        }

        course.enrolledStudents.push(req.user._id);
        await course.save();

        res.json({
            success: true,
            message: "Enrolled successfully"
        });
    } catch (error) {
        next(error);
    }
});

// Student unenroll from course
router.post("/:id/unenroll", protect, authorizeRoles("student"), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found"
        });
    }

    if (!course.enrolledStudents.includes(req.user._id)) {
        return res.status(400).json({
            success: false,
            message: "Not enrolled in this course"
        });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (student) => student.toString() !== req.user._id.toString()
    );

    await course.save();

    res.json({
        success: true,
        message: "Unenrolled successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Course Analytics
router.get("/analytics/stats", protect, authorizeRoles("faculty", "admin"), async (req, res, next) => {
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
      success: true,
      data: {
        totalCourses,
        totalStudents,
        mostPopularCourse,
        averageEnrollment,
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;