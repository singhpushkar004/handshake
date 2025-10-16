const express = require('express');
const Subject = require('../models/Subject')
const router = express.Router();

router.get('/',async(req,res)=>{

    const subject = await Subject.find({status:['active','inactive']});
    return res.json(subject)
})
// for add the subject

router.post('/',async(req,res)=>{
    try {
        const { subject, description, status } = req.body;
        // Check if subject already exists (active/inactive)
        const existingsubject = await Subject.findOne({ subject, status: { $in: ['active', 'inactive'] } });
        if (existingsubject) {
            return res.status(409).json({ message: 'subject already exists.' });
        }
        // Create new subject
        const newsubject = new Subject({ subject, description, status });
        await newsubject.save();
        return res.status(201).json(newsubject);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
})
// api for the delete
router.patch('/:id',async(req,res)=>{
    const {id} = req.params;
    const d = await Subject.findByIdAndUpdate(id,{status:'delete'},{new:true})
    res.json("Deleted Successfully")
})
router.put('/:id',async(req,res)=>{
    const {id} = req.params
    const updateUser = await Subject.findByIdAndUpdate(id,req.body,{new:true});
    return res.json("Updated Successfully")
})

module.exports = router 