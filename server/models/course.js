const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,

  description: String,

  faculty: {
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
});

module.exports = mongoose.model("Course", courseSchema);