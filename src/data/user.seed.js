require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user"); // Make sure path is correct

const users = [
  { username: "Alice", email: "alice@example.com", password: "password123" },
  { username: "Bob", email: "bob@example.com", password: "password456" }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to DB");

    await User.deleteMany(); // Clear existing users
    await User.insertMany(users); // Add new users
    console.log("✅ Users seeded successfully");

    process.exit();
  })
  .catch(err => {
    console.error("❌ Error seeding users database:", err);
    process.exit(1);
  });
