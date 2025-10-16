// Module Schema

const mongoose = require("mongoose");
const moduleSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  description: String,
  status: { type: String, enum: ['active','inactive','delete'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model("Module", moduleSchema);