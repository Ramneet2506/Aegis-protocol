const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: "Deadline must be in the future"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    applications: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            status: {
                type: String,
                enum: ["Applied", "Selected", "Rejected"],
                default: "Applied"
            }
        }
    ]
}, { timestamps: true });

// Indexes for query optimization
opportunitySchema.index({ createdBy: 1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);