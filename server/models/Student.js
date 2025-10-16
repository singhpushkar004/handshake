const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date },
    password: { type: String, default: "1234" },
    status: { type: String, enum: ["Active", "Inactive", "Delete"], default: "Active" },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
