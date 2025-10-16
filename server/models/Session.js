const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // each session should be unique e.g., "2024-2025"
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isCurrent: {
      type: Boolean,
      default: false, // only one session should be active at a time
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Ensure only one session is marked as current
sessionSchema.pre("save", async function (next) {
  if (this.isCurrent) {
    await mongoose.model("Session").updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
  next();
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
