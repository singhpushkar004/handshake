const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Joi = require('joi'); 
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use a strong secret key in production
const CLIENT_URL = 'http://localhost:3000'; // Replace with your client URL
// Nodemailer transporter setup (using Gmail as an example)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'singhpushkar7830@gmail.com',
        pass: 'jnytzzddppjehoml',
    },
});
// Admin Login
router.post('/admin/login', async (req, res) => {
    // Validation schema
    const schema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(4)
            .required()
            .messages({
                'string.min': 'Password must be at least 4 characters long',
                'string.empty': 'Password is required',
                'any.required': 'Password is required',
            }),
    });

    // Validate request body
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    try {
        // Check if user exists and is an admin
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or not an admin' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.json({
            message: 'Login Successfully',
            token,
            admin: { id: admin._id, email: admin.email, role: admin.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// for admin register
router.post('/admin/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let admin = await User.find({ email, role: 'Admin' });
        if (!admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = new User({ name, email, password: hashedPassword, role: 'Admin' });
        await admin.save();
        res.json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
);
module.exports = router;