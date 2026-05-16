const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a course title"],
  },

  description: {
    type: String,
    required: [true, "Please provide a course description"],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  

  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  resources: [
    {
      title: String,
      link: String,
    },
  ],

  announcements: [
    {
      title: String,
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

// Indexes for query optimization
courseSchema.index({ createdBy: 1 });
courseSchema.index({ enrolledStudents: 1 });
courseSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Course", courseSchema);