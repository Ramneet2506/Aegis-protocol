const express = require("express");
const Grievance = require("../models/grievance");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

// Student creates grievance
router.post("/", protect, authorizeRoles("student"), async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const grievance = await Grievance.create({
            title,
            description,
            category,
            student: req.user._id
        });

        res.status(201).json(grievance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Authority views all grievances
// Get grievances (role-based)
router.get("/", protect, async (req, res) => {
    try {

        let grievances;

        if (req.user.role === "student") {
            // Student sees only their grievances
            grievances = await Grievance.find({ student: req.user._id })
                .populate("student", "name email");
        } else if (req.user.role === "authority" || req.user.role === "admin") {
            // Authority/Admin sees all
            grievances = await Grievance.find()
                .populate("student", "name email");
        } else {
            return res.status(403).json({ message: "Not allowed" });
        }

        res.json(grievances);

    } catch (error) {
        res.status(500).json({ error: error.message });
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

module.exports = router;