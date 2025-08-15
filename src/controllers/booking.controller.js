
// src/controllers/booking.controller.js
const Booking = require("../models/Booking");

// Helper to validate ISO date strings (YYYY-MM-DD)
const isISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

/**
 * ADMIN: List all bookings (optionally filtered by status)
 * GET /api/bookings?status=pending
 */
exports.listBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = new RegExp(`^${status}$`, "i");
    const bookings = await Booking.find(filter).populate("userId", " email");
    res.json({ count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * USER: List only the bookings for the logged-in user
 * GET /api/bookings/my
 */
exports.listMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json({ count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get a single booking by ID
 * GET /api/bookings/:id
 */
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("userId", "username email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // If user is not admin, ensure they own the booking
    if (!req.user.isAdmin && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create a booking (USER)
 * POST /api/bookings
 */
exports.createBooking = async (req, res) => {
   console.log("DEBUG createBooking req.body:", req.body);
  const { username, checkInDate, checkOutDate, guests } = req.body;
  if (!username || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!isISODate(checkInDate) || !isISODate(checkOutDate)) {
    return res.status(400).json({ message: "Dates must be YYYY-MM-DD" });
  }

  try {
    const booking = new Booking({
      username,
      checkInDate,
      checkOutDate,
      guests,
      status: "Pending",
      userId: req.user.id, // link booking to logged-in user
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
     console.error("ERROR in createBooking:", err); 
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN: Update booking status
 * PUT /api/bookings/:id/status
 */
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Approved", "Declined"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `Status must be one of ${allowed.join(", ")}` });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * USER: Update own booking
 * PUT /api/bookings/:id
 */
exports.updateBooking = async (req, res) => {
  const updates = {};
  const { username, checkInDate, checkOutDate, guests, status } = req.body;

  if (username) updates.username = username;
  if (checkInDate) {
    if (!isISODate(checkInDate)) return res.status(400).json({ message: "Invalid checkInDate" });
    updates.checkInDate = checkInDate;
  }
  if (checkOutDate) {
    if (!isISODate(checkOutDate)) return res.status(400).json({ message: "Invalid checkOutDate" });
    updates.checkOutDate = checkOutDate;
  }
  if (guests !== undefined) updates.guests = guests;

  // Only admin can change status directly
  if (status) {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admin can update status" });
    }
    const allowed = ["Pending", "Approved", "Declined"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
    updates.status = status;
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // If user is not admin, ensure they own the booking
    if (!req.user.isAdmin && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(booking, updates);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * USER or ADMIN: Delete booking
 * DELETE /api/bookings/:id
 */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!req.user.isAdmin && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
