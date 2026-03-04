const express = require("express");
const Opportunity = require("../models/opportunity");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

// Faculty/Admin create opportunity
router.post("/", protect, authorizeRoles("faculty", "admin"), async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        const opportunity = await Opportunity.create({
            title,
            description,
            deadline,
            postedBy: req.user._id
        });

        res.status(201).json(opportunity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Student apply
router.post("/:id/apply", protect, authorizeRoles("student"), async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) return res.status(404).json({ message: "Not found" });

        const alreadyApplied = opportunity.applications.find(
            app => app.student.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied" });
        }

        opportunity.applications.push({ student: req.user._id });
        await opportunity.save();

        res.json({ message: "Applied successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View all opportunities
router.get("/", protect, async (req, res) => {
    try {
        const opportunities = await Opportunity.find()
            .populate("postedBy", "name email")
            .populate("applications.student", "name email");

        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Authority/Admin update application status
router.put("/:oppId/application/:studentId", 
    protect, 
    authorizeRoles("faculty", "admin"), 
    async (req, res) => {
        try {
            const { status } = req.body;

            const opportunity = await Opportunity.findById(req.params.oppId);
            if (!opportunity) return res.status(404).json({ message: "Not found" });

            const application = opportunity.applications.find(
                app => app.student.toString() === req.params.studentId
            );

            if (!application) return res.status(404).json({ message: "Application not found" });

            application.status = status;
            await opportunity.save();

            res.json(opportunity);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;