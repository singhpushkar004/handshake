// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["info","alert","promo","success"], default: "info" },
  mediaUrl: { type: String },
  redirectUrl: { type: String },
  target: { type: String, default: "all" }, // all | role:student | user:<id>
  priority: { type: String, enum: ["low","medium","high"], default: "medium" },
  readBy: [{ type: String }], // userIds who read
  createdAt: { type: Date, default: Date.now },
  scheduledAt: { type: Date }, // optional scheduling
  status: { type: String, enum: ["Active","Inactive","Delete"], default: "Active" } // for future use
});

module.exports = mongoose.model("Notification", notificationSchema);
