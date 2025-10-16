const express = require("express");
const router = express.Router();
const College = require("../models/College");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
// Add College
router.post("/", async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json(college);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add college in bulk

router.post("/bulk", upload.single("file"), async (req, res) => {
  try {
    const colleges = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        // Row should match schema keys
        colleges.push({
          name: row.name,
          code: row.code,
          address: row.address,
          contactNumber: row.contactNumber,
          email: row.email,
          website: row.website || "",
          status: row.status || "Active",
        });
      })
      .on("end", async () => {
        try {
          await College.insertMany(colleges, { ordered: false });
          res.status(200).json({ message: "Colleges uploaded successfully!" });
        } catch (err) {
          console.error("Error inserting colleges:", err);
          res.status(500).json({ message: "Error inserting colleges", error: err });
        }
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});
// Get All Colleges
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get College by ID
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: "College not found" });
    res.json(college);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update College
router.put("/:id", async (req, res) => {
  try {
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCollege);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete College
router.patch("/:id", async (req, res) => {
  try {
    await College.findByIdAndUpdate(req.params.id,{status:'delete'});
    res.json({ message: "College deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
