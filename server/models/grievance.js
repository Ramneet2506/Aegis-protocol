const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a grievance title"]
    },
    description: {
        type: String,
        required: [true, "Please provide a grievance description"],
        minlength: [10, "Description must be at least 10 characters long"]
    },
    category: {
        type: String,
        required: [true, "Please select a category"]
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    department: {
    type: String,
    enum: [
        "Academic",
        "Hostel",
        "Technical",
        "Library",
        "Examination",
        "Administration"
    ],
},

comments: [
    {
        message: String,

        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        role: String,

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
],
}, { timestamps: true });

// Indexes for query optimization
grievanceSchema.index({ submittedBy: 1, status: 1 });
grievanceSchema.index({ status: 1 });
grievanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Grievance", grievanceSchema);