// src/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  room: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
    default: "Pending",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
