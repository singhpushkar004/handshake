const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['delete','active','inactive'],
        default:'active',
    }
})
module.exports = mongoose.model('Subject',subjectSchema);