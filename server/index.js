// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");

const app = express();

// Recommended: run backend on 5000 to avoid conflict with CRA (3000)
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/handshake";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Your existing routes (kept as-is) ---
app.use('/api/handshakeAdmin/', require('./routes/userAuthRoute'));
app.use('/api/role', require('./routes/roleRoute'));
app.use('/api/session', require('./routes/sessionRoute'));
app.use('/api/location', require('./routes/locationRoute'));
app.use('/api/program', require('./routes/programRoute'));
app.use('/api/technology', require('./routes/technologyRoute'));
app.use('/api/batch', require('./routes/batchRoutes'));
app.use('/api/college', require('./routes/collegeRoutes'));
app.use('/api/branch/', require('./routes/branchRoute'));
app.use('/api/subject/', require('./routes/subjectRoute'));
app.use('/api/topics/', require('./routes/topicRoutes'));
app.use('/api/users', require('./routes/studentRoute'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// --- Notification route (we will create this file) ---
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/contents', require('./routes/contentRoutes'));
app.use('/api/assign-content', require('./routes/assignContent'));
app.use('/api/batch-schedule', require('./routes/batchScheduleRoutes'));
// New submission routes
app.use('/api/', require('./routes/submissionRoute'));
// --- End of your existing routes ---

// create http server and socket.io
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"]
  }
});

// make io available in routes via app.get('io')
app.set("io", io);

// socket events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // optional: join rooms for user-specific sockets
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined room user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// connect mongo then start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(3000, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
