const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
    branch:{
        type:String,
        unique:true,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['delete','active','inactive'],
        default:'active',
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Branch',branchSchema)