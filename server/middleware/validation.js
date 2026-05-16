const { body, validationResult } = require("express-validator");

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((err) => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .isIn(["student", "faculty", "admin", "authority"])
        .withMessage("Invalid role selected"),
];

/**
 * Validation rules for user login
 */
const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for course creation/update
 */
const validateCourse = [
    body("title").trim().notEmpty().withMessage("Course title is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Course description is required")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long"),
];

/**
 * Validation rules for opportunity creation/update
 */
const validateOpportunity = [
    body("title").trim().notEmpty().withMessage("Opportunity title is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Opportunity description is required"),
    body("deadline")
        .isISO8601()
        .withMessage("Valid deadline date is required"),
];

/**
 * Validation rules for grievance creation
 */
const validateGrievance = [
    body("title").trim().notEmpty().withMessage("Grievance title is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Grievance description is required")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long"),
];

/**
 * Validation rules for announcement creation
 */
const validateAnnouncement = [
    body("title").trim().notEmpty().withMessage("Announcement title is required"),
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Announcement message is required"),
];

module.exports = {
    handleValidationErrors,
    validateRegister,
    validateLogin,
    validateCourse,
    validateOpportunity,
    validateGrievance,
    validateAnnouncement,
};
