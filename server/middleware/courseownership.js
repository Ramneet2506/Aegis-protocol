const Course = require("../models/course");

const checkCourseAccess = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ADMIN CAN ACCESS EVERYTHING
    if (req.user.role === "admin") {
      req.course = course;
      return next();
    }

    // FACULTY -> ONLY THEIR OWN COURSE
    if (req.user.role === "faculty") {
      if (
        course.createdBy &&
        course.createdBy.toString() === req.user._id.toString()
      ) {
        req.course = course;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Access denied to this course",
      });
    }

    // STUDENT -> ONLY ENROLLED COURSE
    if (req.user.role === "student") {
      const enrolled = course.enrolledStudents.some(
        (studentId) =>
          studentId.toString() === req.user._id.toString()
      );

      if (enrolled) {
        req.course = course;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = checkCourseAccess;