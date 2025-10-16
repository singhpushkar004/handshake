const mongoose = require('mongoose');

const fileMetaSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  duration: Number // optional, for videos (in seconds) if you extract it
}, { _id: false });

const contentSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },

  // type: physical format of the resource
  type: {
    type: String,
    enum: [
      'pdf','video','doc','pptx','xlsx','image','audio',
      'quiz','assignment','task','readable','recording'
    ],
    required: true
  },

  // category: pedagogical role / classification (assignment, task, learning-objective etc.)
  category: {
    type: String,
    enum: [
      'assignment',
      'task',
      'reading',
      'recording-assignment',
      'learning-outcomes',
      'learning-objective',
      'practice',
      'reference'
    ],
    default: 'reading'
  },

  title: { type: String, required: true },        // short title for content
  description: String,                            // short description
  contentText: String,                            // rich text stored as HTML (for doc/readable)
  file: fileMetaSchema,                           // optional file metadata if uploaded
  url: String,                                    // for link or saved file path (duplicate helpful)
  duration: Number,                               // in seconds for videos/audio
  language: { type: String },                     // optional
  tags: [String],

  // Assignment specific fields
  assignment: {
    dueDate: Date,
    marks: Number,
    submissionType: { type: String, enum: ['file','text','link','both'], default: 'file' },
    maxAttempts: { type: Number, default: 1 },
    isGraded: { type: Boolean, default: true }
  },

  // Publishing & visibility
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  status: { type: String, enum: ['active','inactive','deleted'], default: 'active' }
},
{ timestamps: true });

module.exports = mongoose.model("Content", contentSchema);
