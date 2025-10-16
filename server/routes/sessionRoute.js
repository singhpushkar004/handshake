// routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

//  Create a new session
router.post("/", async (req, res) => {
  try {
    const { name, description,startDate, endDate, isCurrent, status } = req.body;

    const newSession = new Session({
      name,
      description,
      startDate,
      endDate,
      isCurrent,
      status,
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Get a session by ID
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Update a session
router.put("/:id", async (req, res) => {
  try {
    const { name, description,startDate, endDate, isCurrent, status } = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { name, description,startDate, endDate, isCurrent, status },
      { new: true, runValidators: true }
    );

    if (!updatedSession)
      return res.status(404).json({ error: "Session not found" });

    res.json(updatedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Delete a session
router.patch("/:id", async (req, res) => {
  try {
    const deleted = await Session.findByIdAndUpdate(req.params.id,{status:'delete'},{new:true});
    if (!deleted) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Session deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Get the current active session
router.get("/current/active", async (req, res) => {
  try {
    const currentSession = await Session.findOne({ isCurrent: true });
    if (!currentSession)
      return res.status(404).json({ error: "No current session found" });

    res.json(currentSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
