const express = require("express");
const Grievance = require("../models/grievance");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");
const { validateGrievance, handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Student creates grievance
router.post("/", protect, authorizeRoles("student"), validateGrievance, handleValidationErrors, async (req, res, next) => {
    try {
        const { title, description, category } = req.body;

        const grievance = await Grievance.create({
            title,
            description,
            category,
            submittedBy: req.user._id,
            student: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Grievance submitted successfully",
            data: grievance
        });
    } catch (error) {
        next(error);
    }
});

// GET GRIEVANCES (ROLE BASED)
router.get("/", protect, async (req, res, next) => {

  try {

    let filter = {};

    // ==============================
    // STUDENT
    // ==============================
    if (req.user.role === "student") {

      // Student sees ONLY own grievances
      filter.student = req.user._id;

      // Optional category filter
      if (req.query.category) {
        filter.category = req.query.category;
      }

      // Optional department filter
      if (req.query.department) {
        filter.department = req.query.department;
      }

      const grievances =
        await Grievance.find(filter)

          .populate(
            "submittedBy",
            "name email"
          )

          .populate(
            "comments.commentedBy",
            "name role"
          )

          .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: grievances,
      });

    }



    // ==============================
    // AUTHORITY / ADMIN
    // ==============================
    else if (
      req.user.role === "authority" ||
      req.user.role === "admin"
    ) {

      // Authorities can filter
      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.department) {
        filter.department = req.query.department;
      }

      const grievances =
        await Grievance.find(filter)

          .populate(
            "submittedBy",
            "name email"
          )

          .populate(
            "assignedTo",
            "name email"
          )

          .populate(
            "comments.commentedBy",
            "name role"
          )

          .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: grievances,
      });

    }



    // ==============================
    // UNAUTHORIZED
    // ==============================
    else {

      return res.status(403).json({

        success: false,

        message:
          "You do not have permission to access grievances",

      });

    }

  } catch (error) {

    next(error);

  }

});
// Authority updates status
router.put("/:id", protect, authorizeRoles("authority", "admin"), async (req, res) => {
    try {
        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: "Not found" });
        }

        grievance.status = req.body.status;
        await grievance.save();

        res.json(grievance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ADD COMMENT
router.post(
  "/:id/comment",
  protect,
  authorizeRoles("authority", "admin"),
  async (req, res) => {
    try {

      const grievance = await Grievance.findById(req.params.id);

      if (!grievance) {
        return res.status(404).json({
          success: false,
          message: "Grievance not found",
        });
      }

      grievance.comments.push({
        message: req.body.message,
        commentedBy: req.user._id,
        role: req.user.role,
      });

      await grievance.save();

      const updated = await Grievance.findById(req.params.id)
        .populate("comments.commentedBy", "name role");

      res.json({
        success: true,
        data: updated,
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
// ASSIGN DEPARTMENT
router.put(
  "/:id/department",
  protect,
  authorizeRoles("authority", "admin"),
  async (req, res) => {
    try {

      const grievance = await Grievance.findById(req.params.id);

      if (!grievance) {
        return res.status(404).json({
          success: false,
          message: "Grievance not found",
        });
      }

      grievance.department = req.body.department;

      await grievance.save();

      res.json({
        success: true,
        data: grievance,
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