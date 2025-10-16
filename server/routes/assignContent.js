const express = require("express");
const router = express.Router();
const AssignContent = require("../models/AssignContent");

// CREATE
router.post("/", async (req, res) => {
  try {
    const { batchId, subjectId, status } = req.body;

    if (!batchId || !subjectId) {
      return res.status(400).json({ message: "Batch and Subject are required" });
    }

    // prevent duplicate assignment
    const existing = await AssignContent.findOne({ batchId, subjectId });
    if (existing) {
      return res.status(400).json({ message: "This subject is already assigned to this batch" });
    }

    const data = new AssignContent({ batchId, subjectId, status });
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error creating assignment", error: err });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const data = await AssignContent.find()
      .populate("batchId")
      .populate("subjectId");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { batchId, subjectId, status } = req.body;
    const updated = await AssignContent.findByIdAndUpdate(
      req.params.id,
      { batchId, subjectId, status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating assignment" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await AssignContent.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting assignment" });
  }
});

module.exports = router;
