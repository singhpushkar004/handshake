const express = require('express');
const Technology = require('../models/Technology');
const router = express.Router();

// ✅ Get all active/inactive technologies
router.get('/', async (req, res) => {
    try {
        const technologies = await Technology.find({ status: { $in: ['active', 'inactive'] } });
        return res.json(technologies);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ Add a new technology
router.post('/', async (req, res) => {
    try {
        const { name, description, status } = req.body;

        // Check if technology already exists
        const existingTech = await Technology.findOne({
            name,
            status: { $in: ['active', 'inactive'] }
        });

        if (existingTech) {
            return res.status(409).json({ message: 'Technology already exists.' });
        }

        const newTech = new Technology({ name, description, status });
        await newTech.save();

        return res.status(201).json(newTech);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ Soft delete (set status = delete)
router.patch('/:id', async (req, res) => {
    try {
        await Technology.findByIdAndUpdate(req.params.id, { status: 'delete' }, { new: true });
        return res.json({ message: 'Deleted Successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ Update technology
router.put('/:id', async (req, res) => {
    try {
        await Technology.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ message: 'Updated Successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
