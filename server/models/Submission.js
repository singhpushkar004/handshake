const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    submissionType: { type: String, enum: ["text", "file"], default: "text" },
    textAnswer: { type: String, default: "" },
    file: { type: { path: String, originalName: String }, default: null },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
