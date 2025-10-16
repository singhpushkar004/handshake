const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

//  Create Topic (after selecting a Subject)
router.post('/', async (req, res) => {
  try {
    const { SubjectId, title, order, description } = req.body;

    // Validation
    if (!SubjectId || !title) {
      return res.status(400).json({ message: "Subject ID and Title are required." });
    }

    //  Check if Subject exists
    const subjectExists = await Subject.findById(SubjectId);
    if (!subjectExists) {
      return res.status(404).json({ message: "Subject not found." });
    }

    //  Create Topic
    const newTopic = await Topic.create({
      SubjectId,
      title,
      order,
      description
    });

    res.status(201).json({ message: "Topic created successfully", topic: newTopic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Get all Topics under a specific Subject
router.get('/subject/:SubjectId', async (req, res) => {
  try {
    const topics = await Topic.find({ SubjectId: req.params.SubjectId })
                              .sort({ order: 1 })
                              .populate('SubjectId', 'name description'); // Optional populate

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//  Update Topic
router.put('/:id', async (req, res) => {
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Topic updated successfully", topic: updatedTopic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Delete Topic
router.delete('/:id', async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
