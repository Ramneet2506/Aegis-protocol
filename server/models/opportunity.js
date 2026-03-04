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

module.exports = mongoose.model("Opportunity", opportunitySchema);