const express = require('express');
const Program = require('../models/Program');
const router = express.Router();

// Get all active/inactive programs
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find({ status: { $in: ['active', 'inactive'] } });
        return res.json(programs);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add a new program
router.post('/', async (req, res) => {
    try {
        const { program, description, status } = req.body;

        // Check if program already exists (active/inactive)
        const existingProgram = await Program.findOne({
            program,
            status: { $in: ['active', 'inactive'] }
        });

        if (existingProgram) {
            return res.status(409).json({ message: 'Program already exists.' });
        }

        // Create new program
        const newProgram = new Program({ program, description, status });
        await newProgram.save();

        return res.status(201).json(newProgram);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Soft delete program (update status to delete)
router.patch('/:id', async (req, res) => {
    try {
        await Program.findByIdAndUpdate(req.params.id, { status: 'delete' }, { new: true });
        return res.json({ message: 'Deleted Successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update program
router.put('/:id', async (req, res) => {
    try {
        await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ message: 'Updated Successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
