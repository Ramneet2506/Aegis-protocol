const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    attachment: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    submissions: [

      {

        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        file: {
          type: String,
        },

        submittedAt: {
          type: Date,
          default: Date.now,
        },

        isLate: {
          type: Boolean,
          default: false,
        },

      },

    ],

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Assignment",
  assignmentSchema
);