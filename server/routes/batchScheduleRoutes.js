const express = require('express');
const router = express.Router();
const BatchSchedule = require('../models/BatchSchedule');

// Bulk Add/Update Schedule for a Batch
router.post('/:batchId', async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const schedules = req.body; // Array of { topicId, unlockDate }

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ message: "Schedules array required" });
    }

    // Upsert each schedule
    const bulkOps = schedules.map(s => ({
      updateOne: {
        filter: { batchId, topicId: s.topicId },
        update: { $set: { unlockDate: s.unlockDate } },
        upsert: true
      }
    }));

    await BatchSchedule.bulkWrite(bulkOps);

    res.json({ message: "Schedules updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Schedule for a Batch
router.get('/:batchId', async (req, res) => {
  try {
    const schedules = await BatchSchedule.find({ batchId: req.params.batchId }).populate('topicId');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
