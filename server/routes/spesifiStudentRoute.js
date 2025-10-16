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


