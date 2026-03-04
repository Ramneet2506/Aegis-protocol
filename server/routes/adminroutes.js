const express = require("express");
const User = require("../models/user");
const Grievance = require("../models/grievance");
const Course = require("../models/course");
const Opportunity = require("../models/opportunity");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.countDocuments();
      const grievances = await Grievance.countDocuments();
      const courses = await Course.countDocuments();
      const opportunities = await Opportunity.countDocuments();

      res.json({ users, grievances, courses, opportunities });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);
module.exports = router;