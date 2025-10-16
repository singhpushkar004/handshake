const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
   college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
   branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
   mobile: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
   batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
   dob: { type: Date },
   gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" }, // ✅ Added
   image: { type: String },
   password: { type: String, required: true },
   status: { type: String, enum: ["Active", "Inactive", "Delete"], default: "Active" },
   session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
   role: { type: String, enum: ['Student', 'Admin','Course Coordinator','Consultant','HR'], default: 'Student' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
