const express = require('express');
const Branch = require('../models/Branch')
const router = express.Router();

router.get('/',async(req,res)=>{

    const branch = await Branch.find({status:['active','inactive']});
    return res.json(branch)
})
// for add the Branch

router.post('/',async(req,res)=>{
    try {
        const { branch, description, status } = req.body;
        // Check if Branch already exists (active/inactive)
        const existingBranch = await Branch.findOne({ branch, status: { $in: ['active', 'inactive'] } });
        if (existingBranch) {
            return res.status(409).json({ message: 'Branch already exists.' });
        }
        // Create new Branch
        const newBranch = new Branch({ branch, description, status });
        await newBranch.save();
        return res.status(201).json(newBranch);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
})
// api for the delete
router.patch('/:id',async(req,res)=>{
    const {id} = req.params;
    const d = await Branch.findByIdAndUpdate(id,{status:'delete'},{new:true})
    res.json("Deleted Successfully")
})
router.put('/:id',async(req,res)=>{
    const {id} = req.params
    const updateUser = await Branch.findByIdAndUpdate(id,req.body,{new:true});
    return res.json("Updated Successfully")
})

module.exports = router 