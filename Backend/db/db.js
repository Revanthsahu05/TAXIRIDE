const mongoose = require("mongoose");
const dbgr = require("debug")("development:db.js");
const DB_URI = process.env.DB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    dbgr("Connected to the MongoDB database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
