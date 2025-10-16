// BatchSchedule Schema
const mongoose = require("mongoose");

const batchScheduleSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  unlockDate: { type: Date, required: true },
   status: { type: String, enum: ['active','inactive','delete'], default: 'active' }
}, { timestamps: true });

batchScheduleSchema.index({ batchId: 1, topicId: 1 }, { unique: true });
module.exports = mongoose.model("BatchSchedule", batchScheduleSchema);