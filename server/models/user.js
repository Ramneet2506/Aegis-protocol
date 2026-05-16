const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ["student", "faculty", "authority", "admin"],
        default: "student"
    }
}, { timestamps: true });

// Indexes for query optimization

userSchema.index({ role: 1 });

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);