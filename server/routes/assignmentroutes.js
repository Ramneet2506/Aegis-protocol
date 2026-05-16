const express = require("express");

const router = express.Router();

const Assignment = require("../models/assignment");
const Course = require("../models/course");

const upload = require("../middleware/uploadAssignment");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authmiddleware");



// ==============================
// CREATE ASSIGNMENT
// ==============================

router.post(
  "/:courseId",
  protect,
  authorizeRoles("faculty", "admin"),

  async (req, res) => {

    try {

      const course = await Course.findById(
        req.params.courseId
      );

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Faculty can only access own course
      if (
        req.user.role === "faculty" &&
        course.createdBy.toString() !==
          req.user._id.toString()
      ) {

        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const assignment = await Assignment.create({

        course: req.params.courseId,

        title: req.body.title,

        description: req.body.description,

        dueDate: req.body.dueDate,

        createdBy: req.user._id,

      });

      res.status(201).json({
        success: true,
        data: assignment,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }
);



// ==============================
// GET ASSIGNMENTS OF COURSE
// ==============================

router.get(
  "/course/:courseId",
  protect,

  async (req, res) => {

    try {

      const assignments = await Assignment.find({
        course: req.params.courseId,
      })

        .populate("createdBy", "name")

        .populate(
          "submissions.student",
          "name email"
        )

        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: assignments,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }
);



// ==============================
// SUBMIT ASSIGNMENT
// ==============================

router.post(
  "/submit/:assignmentId",

  protect,

  authorizeRoles("student"),

  upload.single("file"),

  async (req, res) => {

    try {

      const assignment =
        await Assignment.findById(
          req.params.assignmentId
        );

      if (!assignment) {

        return res.status(404).json({
          success: false,
          message: "Assignment not found",
        });

      }

      // Check existing submission
      const existingSubmission =
        assignment.submissions.find(

          (submission) =>
            submission.student.toString() ===
            req.user._id.toString()
        );

      // Late submission check
      const isLate =
        new Date() >
        new Date(assignment.dueDate);

      if (existingSubmission) {

        // Resubmit
        existingSubmission.file =
          req.file.path;

        existingSubmission.submittedAt =
          new Date();

        existingSubmission.isLate =
          isLate;

      } else {

        // New submission
        assignment.submissions.push({

          student: req.user._id,

          file: req.file.path,

          submittedAt: new Date(),

          isLate,

        });

      }

      await assignment.save();

      res.json({
        success: true,
        message:
          "Assignment submitted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }
);
// ==============================
// REMOVE SUBMISSION
// ==============================

router.delete(
  "/remove/:assignmentId",

  protect,

  authorizeRoles("student"),

  async (req, res) => {

    try {

      const assignment =
        await Assignment.findById(
          req.params.assignmentId
        );

      if (!assignment) {

        return res.status(404).json({
          success: false,
          message: "Assignment not found",
        });

      }

      assignment.submissions =
        assignment.submissions.filter(

          (submission) =>
            submission.student.toString() !==
            req.user._id.toString()
        );

      await assignment.save();

      res.json({
        success: true,
        message: "Submission removed",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }
);


module.exports = router;