const express = require('express');
const Location = require('../models/Location')
const router = express.Router();

router.get('/',async(req,res)=>{

    const location = await Location.find({status:['active','inactive']});
    return res.json(location)
})
// for add the Location

router.post('/',async(req,res)=>{
    try {
        const { location, description, status } = req.body;
        // Check if Location already exists (active/inactive)
        const existingLocation = await Location.findOne({ Location, status: { $in: ['active', 'inactive'] } });
        if (existingLocation) {
            return res.status(409).json({ message: 'Location already exists.' });
        }
        // Create new Location
        const newLocation = new Location({ location, description, status });
        await newLocation.save();
        return res.status(201).json(newLocation);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
})
// api for the delete
router.patch('/:id',async(req,res)=>{
    const {id} = req.params;
    const d = await Location.findByIdAndUpdate(id,{status:'delete'},{new:true})
    res.json("Deleted Successfully")
})
router.put('/:id',async(req,res)=>{
    const {id} = req.params
    const updateUser = await Location.findByIdAndUpdate(id,req.body,{new:true});
    return res.json("Updated Successfully")
})

module.exports = router 