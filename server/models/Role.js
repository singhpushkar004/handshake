const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    role:{
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

module.exports = mongoose.model('Role',roleSchema)