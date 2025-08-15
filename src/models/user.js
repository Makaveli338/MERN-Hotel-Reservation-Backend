const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Stored as plain text
  role:     { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

// No hashing before saving — store password as-is
userSchema.pre("save", function (next) {
  next();
});

// Static method to find user by username
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// Compare passwords directly (plain text)
userSchema.methods.comparePassword = function (password) {
  return this.password === password;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
