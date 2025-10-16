const mongoose = require('mongoose');
const assignContentSchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required:true,
    },
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true,  
    },
    status:{
        type:String,
        enum:["Delete","Inactive","Active"],
        default:"Active",
    }

},{
    timestamps:true
})

module.exports = mongoose.model("AssignContent",assignContentSchema);