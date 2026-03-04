const express = require("express");
const Announcement = require("../models/Announcement");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

/*
POST ANNOUNCEMENT
Faculty or Admin can post
*/
router.post("/", protect, authorizeRoles("faculty", "admin"), async (req, res) => {
  try {
    const { title, message } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      postedBy: req.user._id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
GET ALL ANNOUNCEMENTS
All users can view
*/
router.get("/", protect, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;