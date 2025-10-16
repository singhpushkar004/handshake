const express = require("express");
const router = express.Router();
const multer = require("multer");
const Notification = require("../models/Notification");

// --- Multer Setup for media upload ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/notifications"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --------------------------------------
// Create a new notification
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { title, message, type, target, priority, redirectUrl, scheduledAt } =
      req.body;

    const newNotification = new Notification({
      title,
      message,
      type,
      target,
      priority,
      redirectUrl,
      scheduledAt,
      mediaUrl: req.file ? `/uploads/notifications/${req.file.filename}` : null,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({status:['Active','Inactive']}).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------
// Get a single notification by ID
router.get("/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------
// Update a notification
router.put("/:id", upload.single("media"), async (req, res) => {
  try {
    const { title, message, type, target, priority, redirectUrl, scheduledAt } =
      req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        type,
        target,
        priority,
        redirectUrl,
        scheduledAt,
        mediaUrl: req.file
          ? `/uploads/notifications/${req.file.filename}`
          : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedNotification)
      return res.status(404).json({ error: "Notification not found" });

    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// Soft delete (mark as deleted by setting status in future if needed)
router.patch("/:id", async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndUpdate(
      req.params.id,
      { priority: "low", status: "Delete" }, // simple soft delete style
      { new: true }
    );

    if (!deleted)
      return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------
// Mark notification as read by a user
router.post("/:id/read/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: userId } }, // add only if not already
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Marked as read", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------
// Get unread notifications for a user
router.get("/unread/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const unread = await Notification.find({ readBy: { $ne: userId } }).sort({
      createdAt: -1,
    });
    res.json(unread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
