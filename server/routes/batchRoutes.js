const express = require("express");
const Batch = require("../models/Batch");
const router = express.Router();

// ✅ Get all batches with populated Program, Technology, Session
router.get("/", async (req, res) => {
  try {
    const batches = await Batch.find({ status: { $in: ["active", "inactive"] } })
      .populate("programId", "program")
      .populate("technologyId", "name")
      .populate("sessionId", "name"); // session field from your Session model

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add new batch
router.post("/", async (req, res) => {
  try {
    const { name, programId, technologyId, sessionId, description, status } = req.body;

    const newBatch = new Batch({
      name,
      programId,
      technologyId,
      sessionId,
      description,
      status
    });

    await newBatch.save();
    res.status(201).json(newBatch);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update batch
router.put("/:id", async (req, res) => {
  try {
    await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Batch updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Soft delete batch
router.patch("/:id", async (req, res) => {
  try {
    await Batch.findByIdAndUpdate(req.params.id, { status: "delete" }, { new: true });
    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
