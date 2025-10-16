const mongoose = require("mongoose");
const topicSchema = new mongoose.Schema({
  SubjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  description: String,
  status: { type: String, enum: ['active','inactive','delete'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);