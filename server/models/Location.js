const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    location:{
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

module.exports = mongoose.model('Location',locationSchema)