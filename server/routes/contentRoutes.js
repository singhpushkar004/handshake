const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Content = require("../models/Content");
const Subject = require("../models/Subject");
const Topic = require("../models/Topic");

const router = express.Router();

// Storage: organize by date to avoid too many files in single folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/content/${new Date().toISOString().slice(0, 10)}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e6) + ext);
  },
});

// Allowed MIME types with more comprehensive list
const allowedMime = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "image/jpeg",
  "image/png",
  "image/gif",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "text/plain",
];

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: (req, file, cb) => {
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
});

// Helper to delete file safely
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete file:", err.message);
    });
  }
};

// Create content (supports file or contentText)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const {
      subjectId,
      topicId,
      type,
      category,
      title,
      description,
      contentText,
      assignment_dueDate,
      assignment_marks,
      assignment_submissionType,
      assignment_maxAttempts,
      isPublished,
    } = req.body;

    // Required fields validation
    if (!subjectId || !topicId || !type || !title) {
      return res.status(400).json({ error: "subjectId, topicId, type, and title are required." });
    }

    // Enum validation (from schema)
    const validTypes = [
      "pdf",
      "video",
      "doc",
      "pptx",
      "xlsx",
      "image",
      "audio",
      "quiz",
      "assignment",
      "task",
      "readable",
      "recording",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid content type." });
    }

    const validCategories = [
      "assignment",
      "task",
      "reading",
      "recording-assignment",
      "learning-outcomes",
      "learning-objective",
      "practice",
      "reference",
    ];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category." });
    }

    const contentDoc = {
      subjectId,
      topicId,
      type,
      category: category || "reading",
      title,
      description,
      contentText: contentText || undefined,
      isPublished: isPublished === "true" || isPublished === true,
      publishedAt: (isPublished === "true" || isPublished === true) ? new Date() : undefined,
    };

    if (req.file) {
      contentDoc.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      contentDoc.url = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    // Assignment fields validation
    if (type === "assignment") {
      if (!assignment_dueDate) {
        return res.status(400).json({ error: "Due date is required for assignments." });
      }
      if (!assignment_marks || isNaN(assignment_marks) || Number(assignment_marks) <= 0) {
        return res.status(400).json({ error: "Marks must be a positive number." });
      }
      const validSubmissionTypes = ["file", "text", "link", "both"];
      if (assignment_submissionType && !validSubmissionTypes.includes(assignment_submissionType)) {
        return res.status(400).json({ error: "Invalid submission type." });
      }
      if (assignment_maxAttempts && (isNaN(assignment_maxAttempts) || Number(assignment_maxAttempts) < 1)) {
        return res.status(400).json({ error: "Max attempts must be at least 1." });
      }
    }

    if (
      assignment_dueDate ||
      assignment_marks ||
      assignment_submissionType ||
      assignment_maxAttempts
    ) {
      contentDoc.assignment = {
        dueDate: assignment_dueDate ? new Date(assignment_dueDate) : undefined,
        marks: assignment_marks ? Number(assignment_marks) : undefined,
        submissionType: assignment_submissionType || "file",
        maxAttempts: assignment_maxAttempts ? Number(assignment_maxAttempts) : 1,
      };
    }

    const saved = await Content.create(contentDoc);
    res.status(201).json({ message: "Content saved", content: saved });
  } catch (err) {
    console.error(err);
    // Cleanup uploaded file on error
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

// Get all content (optionally filter by subject/topic/type/category, add pagination)
router.get("/", async (req, res) => {
  try {
    const { subjectId, topicId, type, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (subjectId) query.subjectId = subjectId;
    if (topicId) query.topicId = topicId;
    if (type) query.type = type;
    if (category) query.category = category;

    const items = await Content.find(query)
      .populate("subjectId", "subject")
      .populate("topicId", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Content.countDocuments(query);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/all", async (req, res) => {
  try {
   

    const items = await Content.find()
      .populate("subjectId", "subject")
      .populate("topicId", "title")
      .sort({ createdAt: -1 })
      // 

    // const total = await Content.countDocuments(query);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single content
// router.get("/:id", async (req, res) => {
//   try {
//     const item = await Content.findById(req.params.id)
//       .populate("subjectId", "subject")
//       .populate("topicId", "title");
//     if (!item) return res.status(404).json({ error: "Content not found" });
//     res.json(item);
//   } catch (err) {
//     res.status(500).json({ error: "err.message" });
//   }
// });

// Update content (support replacing file, delete old file if replaced)
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const existing = await Content.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Content not found" });

    const update = { ...req.body };

    // Enum validation similar to POST
    if (update.type) {
      const validTypes = [
        "pdf",
        "video",
        "doc",
        "pptx",
        "xlsx",
        "image",
        "audio",
        "quiz",
        "assignment",
        "task",
        "readable",
        "recording",
      ];
      if (!validTypes.includes(update.type)) {
        return res.status(400).json({ error: "Invalid content type." });
      }
    }

    if (update.category) {
      const validCategories = [
        "assignment",
        "task",
        "reading",
        "recording-assignment",
        "learning-outcomes",
        "learning-objective",
        "practice",
        "reference",
      ];
      if (!validCategories.includes(update.category)) {
        return res.status(400).json({ error: "Invalid category." });
      }
    }

    if (req.file) {
      // Delete old file if exists
      if (existing.file && existing.file.path) {
        deleteFile(existing.file.path);
      }
      update.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      update.url = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    // Handle isPublished and publishedAt
    if (update.isPublished !== undefined) {
      const isPub = update.isPublished === "true" || update.isPublished === true;
      update.isPublished = isPub;
      if (isPub && !existing.isPublished) {
        update.publishedAt = new Date();
      }
    }

    // Assignment fields validation
    if (update.type === "assignment" || existing.type === "assignment") {
      if (req.body.assignment_dueDate && !isNaN(Date.parse(req.body.assignment_dueDate))) {
        update.assignment = { ...update.assignment, dueDate: new Date(req.body.assignment_dueDate) };
      }
      if (req.body.assignment_marks && !isNaN(req.body.assignment_marks) && Number(req.body.assignment_marks) > 0) {
        update.assignment = { ...update.assignment, marks: Number(req.body.assignment_marks) };
      }
      const validSubmissionTypes = ["file", "text", "link", "both"];
      if (req.body.assignment_submissionType && validSubmissionTypes.includes(req.body.assignment_submissionType)) {
        update.assignment = { ...update.assignment, submissionType: req.body.assignment_submissionType };
      }
      if (req.body.assignment_maxAttempts && !isNaN(req.body.assignment_maxAttempts) && Number(req.body.assignment_maxAttempts) >= 1) {
        update.assignment = { ...update.assignment, maxAttempts: Number(req.body.assignment_maxAttempts) };
      }
    }

    const updated = await Content.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
    res.json({ message: "Content updated", content: updated });
  } catch (err) {
    console.error(err);
    // Cleanup new file on error
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({ error: err.message });
  }
});

// Delete content
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Content.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    // Delete physical file if present
    if (deleted.file && deleted.file.path) {
      deleteFile(deleted.file.path);
    }

    res.json({ message: "Content deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 
// GET all subjects (for the filter dropdown)
router.get("/subjects/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// GET topics for a subject (optional secondary filter)
router.get("/topics/:subjectId", async (req, res) => {
  try {
    const topics = await require("../models/Topic")
      .find({ subjectId: req.params.subjectId }, "title")
      .sort({ title: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// GET contents grouped by topic for a subject (for the right-side list)
router.get("/by-subject/:subjectId", async (req, res) => {
  try {
    const { topicId } = req.query;               // optional filter
    const match = { subjectId: req.params.subjectId };
    if (topicId) match.topicId = topicId;

    const contents = await Content.find(match)
      .populate("topicId", "title")
      .select("title type category url file contentText assignment")
      .sort({ createdAt: -1 });

    // Group by topic
    const grouped = contents.reduce((acc, cur) => {
      const key = cur.topicId?._id || "other";
      if (!acc[key]) acc[key] = { topic: cur.topicId, items: [] };
      acc[key].items.push(cur);
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// GET a single content (for the left-side viewer)
router.get("/view/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate("subjectId", "subject")
      .populate("topicId", "title");
    if (!content) return res.status(404).json({ error: "Not found" });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------
// COMMENT ROUTES (simple, you can secure with auth later)
router.post("/:contentId/comments", async (req, res) => {
  const { text, author = "Anonymous" } = req.body;
  try {
    const content = await Content.findById(req.params.contentId);
    if (!content) return res.status(404).json({ error: "Content not found" });
    content.comments = content.comments || [];
    content.comments.push({ text, author, date: new Date() });
    await content.save();
    res.json({ message: "Comment added", comment: content.comments.slice(-1)[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:contentId/comments/:commentId", async (req, res) => {
  try {
    const content = await Content.findById(req.params.contentId);
    if (!content) return res.status(404).json({ error: "Content not found" });
    content.comments.id(req.params.commentId).remove();
    await content.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;