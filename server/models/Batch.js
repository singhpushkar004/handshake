const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
        required: true
    },
    technologyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session", // assuming you already have a Session model
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'delete'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model("Batch", batchSchema);
    