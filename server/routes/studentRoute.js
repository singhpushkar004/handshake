const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const csv = require("csvtojson");
const User = require("../models/User");
const College = require("../models/College");
const Branch = require("../models/Branch");
const Location = require("../models/Location");
const Session = require("../models/Session");
const Program = require("../models/Program");
const Batch = require("../models/Batch");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Get all users
// GET /api/users?search=ram&status=Active&role=Student
router.get("/", async (req, res) => {
  try {
    const { search, role, branch, location } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } }
      ];
    }

    // Status filter (Active + Inactive only)
    query.status = { $in: ["Active", "Inactive"] };

    // Role filter
    if (role) query.role = role;

    // Branch filter
    if (branch) query.branch = branch;

    // Location filter
    if (location) query.location = location;

    const users = await User.find(query)
      .populate("college branch program batch session location");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Add user manually
router.post("/", async (req, res) => {
  try {
    const plainPassword = req.body.password || "1234";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Bulk upload users
router.post("/bulk", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const usersArray = await csv().fromFile(req.file.path);
    let inserted = [];
    let failed = [];

    for (let row of usersArray) {
      try {
        // ✅ Find references by name (not ID)
        const location = await Location.findOne({ location: row.location?.trim() });
        const college = await College.findOne({ name: row.college?.trim() });
        const branch = await Branch.findOne({ branch: row.branch?.trim() });
        const session = await Session.findOne({ name: row.session?.trim() });
        const program = await Program.findOne({ name: row.program?.trim() }); // ⚡ fixed
        const batch = await Batch.findOne({ name: row.batch?.trim() });

        if (!location || !college || !branch || !session || !program || !batch) {
          failed.push({ row, error: "Mapping failed (invalid refs)" });
          continue;
        }

        // ✅ Prevent duplicates
        const exists = await User.findOne({ $or: [{ email: row.email }, { mobile: row.mobile }] });
        if (exists) {
          failed.push({ row, error: "Duplicate user" });
          continue;
        }

        // ✅ Create new user
        const newUser = new User({
          name: row.name,
          location: location._id,
          college: college._id,
          branch: branch._id,
          program: program._id,
          batch: batch._id,
          mobile: row.mobile,
          email: row.email,
          gender: row.gender || "Male",
          dob: row.dob ? new Date(row.dob) : null, // ⚡ convert to Date
          password: await bcrypt.hash(row.password || "1234", 10),
          status: row.status || "Active",
          session: session._id,
        });

        await newUser.save();
        inserted.push(newUser);
      } catch (err) {
        failed.push({ row, error: err.message });
      }
    }

    res.json({
      message: "Bulk upload completed",
      inserted: inserted.length,
      failed: failed.length,
      failedRows: failed,
    });
  } catch (err) {
    res.status(500).json({ error: "Bulk upload failed", details: err.message });
  }
});

// ✅ Update user
// ✅ Simple Update User
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Soft delete
router.patch("/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "Delete" });
  res.status(200).json({ message: "Deleted successfully" });
});

router.patch("/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = user.status === "Active" ? "Inactive" : "Active";
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// change password
router.post("/change-password", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = req.body;
 // 3️⃣ Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    // 1️⃣ Check all fields
    if (!userId || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
        // 4️⃣ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect." });

 // 5️⃣ Prevent reuse of same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame)
      return res.status(400).json({
        message: "New password cannot be the same as old password.",
      });

    // 2️⃣ Check if new and confirm passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

   



   

    // 6️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 7️⃣ Update password in DB
    user.password = hashedPassword;
    await user.save();

    // 8️⃣ Send success
    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// specific students
router.get("/:id",async(req,res)=>{
  const {id} = req.params;
  const user = await User.findById(id).populate("program").populate("batch");
  return res.json(user)
})
module.exports = router;
