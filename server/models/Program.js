const mongoose = require("mongoose");
const programSchema = new mongoose.Schema({
  program: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  technologies: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }
  ],
  status: {
    type: String,
    enum: ['delete','active','inactive'],
    default:'active',
  }
}, { timestamps:true });

module.exports = mongoose.model("Program", programSchema);
