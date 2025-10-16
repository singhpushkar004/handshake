const express = require('express');
const Role = require('../models/Role')
const router = express.Router();

router.get('/',async(req,res)=>{

    const role = await Role.find({status:['active','inactive']});
    return res.json(role)
})
// for add the role

router.post('/',async(req,res)=>{
    try {
        const { role, description, status } = req.body;
        // Check if role already exists (active/inactive)
        const existingRole = await Role.findOne({ role, status: { $in: ['active', 'inactive'] } });
        if (existingRole) {
            return res.status(409).json({ message: 'Role already exists.' });
        }
        // Create new role
        const newRole = new Role({ role, description, status });
        await newRole.save();
        return res.status(201).json(newRole);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
})
// api for the delete
router.patch('/:id',async(req,res)=>{
    const {id} = req.params;
    const d = await Role.findByIdAndUpdate(id,{status:'delete'},{new:true})
    res.json("Deleted Successfully")
})
router.put('/:id',async(req,res)=>{
    const {id} = req.params
    const updateUser = await Role.findByIdAndUpdate(id,req.body,{new:true});
    return res.json("Updated Successfully")
})

module.exports = router 