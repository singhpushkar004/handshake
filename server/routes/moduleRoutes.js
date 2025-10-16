const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

// Create Module
router.post('/', async (req, res) => {
  try {
    const { programId, title, order, description } = req.body;
    if (!programId || !title) {
      return res.status(400).json({ message: "Program ID and Title required" });
    }

    const newModule = await Module.create({
      programId,
      title,
      order,
      description
    });

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Modules by Program
router.get('/program/:programId', async (req, res) => {
  try {
    const modules = await Module.find({ programId: req.params.programId, status: 'active' }).sort({ order: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
