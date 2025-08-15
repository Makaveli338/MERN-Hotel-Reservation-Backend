const express = require("express");
const controller = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// USER: View own bookings
router.get("/my", authMiddleware(), controller.listMyBookings);

// ADMIN: View all bookings
router.get("/", authMiddleware("admin"), controller.listBookings);

// USER: Create booking
router.post("/", authMiddleware(), controller.createBooking);

// ADMIN: Update booking status
router.patch("/:id/status", authMiddleware("admin"), controller.updateBookingStatus);

// USER: Update own booking
router.put("/:id", authMiddleware(), controller.updateBooking);

// USER or ADMIN: Delete booking
router.delete("/:id", authMiddleware(), controller.deleteBooking);

module.exports = router;
