const express = require("express");
const router = express.Router();
// const { Content, Submission } = require("./schemas");
const Content = require("../models/Content");
const Submission = require("../models/Submission");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalName)}`);
  },
});
const upload = multer({ storage });

// Get all assignments for a subject
router.get("/contents/all", async (req, res) => {
  try {
    const contents = await Content.find({ type: "assignment" }).populate("subjectId topicId");
    // Group by topic for unique topics
    const grouped = contents.reduce((acc, c) => {
      const topic = c.topicId?.title || "General";
      if (!acc[topic]) acc[topic] = [];
      if (!acc[topic].some((item) => item._id.toString() === c._id.toString())) {
        acc[topic].push(c);
      }
      return acc;
    }, {});
    // Unique topics for the right side
    const uniqueTopics = Object.keys(grouped);
    res.json({ assignments: contents, uniqueTopics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all submissions for a student and subject
router.get("/submissions/student/:studentId/subject/:subjectId", async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const submissions = await Submission.find({ studentId, subjectId });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get submission for a specific content
router.get("/submissions/student/:studentId/content/:contentId", async (req, res) => {
  try {
    const { studentId, contentId } = req.params;
    const submission = await Submission.findOne({ studentId, contentId });
    res.json(submission || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit a new assignment
router.post("/submissions/submit", upload.single("file"), async (req, res) => {
  try {
    const { studentId, subjectId, contentId, textAnswer, submissionType } = req.body;
    const file = req.file ? { path: req.file.path, originalName: req.file.originalname } : null;

    // Validate submissionType
    if (!["text", "file"].includes(submissionType)) {
      return res.status(400).json({ message: "Invalid submission type" });
    }

    // Check for existing submission
    const existing = await Submission.findOne({ studentId, contentId });
    if (existing) {
      return res.status(400).json({ message: "Submission already exists" });
    }

    // Validate input based on submissionType
    if (submissionType === "text" && !textAnswer) {
      return res.status(400).json({ message: "Text answer is required for text submission" });
    }
    if (submissionType === "file" && !file) {
      return res.status(400).json({ message: "File is required for file submission" });
    }

    const submission = new Submission({
      studentId,
      subjectId,
      contentId,
      submissionType,
      textAnswer: submissionType === "text" ? textAnswer : "",
      file: submissionType === "file" ? file : null,
      submittedAt: new Date(),
      status: "pending",
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an existing submission
router.put("/submissions/update/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { textAnswer, submissionType } = req.body;
    const file = req.file ? { path: req.file.path, originalName: req.file.originalname } : null;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Validate submissionType
    if (!["text", "file"].includes(submissionType)) {
      return res.status(400).json({ message: "Invalid submission type" });
    }

    // Validate input based on submissionType
    if (submissionType === "text" && !textAnswer) {
      return res.status(400).json({ message: "Text answer is required for text submission" });
    }
    if (submissionType === "file" && !file) {
      return res.status(400).json({ message: "File is required for file submission" });
    }

    // Delete old file if switching to text or uploading a new file
    if (submission.file && submission.file.path) {
      if (submissionType === "text" || (submissionType === "file" && file)) {
        try {
          fs.unlinkSync(submission.file.path);
        } catch (err) {
          console.error("Error deleting old file:", err);
        }
      }
    }

    submission.submissionType = submissionType;
    submission.textAnswer = submissionType === "text" ? textAnswer : "";
    submission.file = submissionType === "file" ? file : null;
    submission.updatedAt = new Date();

    await submission.save();
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a submission
router.delete("/submissions/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Delete file if exists
    if (submission.file && submission.file.path) {
      try {
        fs.unlinkSync(submission.file.path);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    await submission.deleteOne();
    res.json({ message: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;