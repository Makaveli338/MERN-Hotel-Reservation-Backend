const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import routes
const bookingsRoutes = require("./routes/booking.routes");
const userRoutes = require("./routes/user.routes");

// Middleware to parse JSON
app.use(express.json());

// ✅ Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // concise logs for dev
}

// ✅ Global request logger (for debugging every request)
app.use((req, res, next) => {
  console.log("GLOBAL LOGGER:", req.method, req.url, req.body);
  next();
});

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-hotel-reservation-frontend.onrender.com",
    ],
    credentials: true,
  })
);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// ✅ Mount routes
app.use("/api/bookings", bookingsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes); // ⚠️ check if this should really be the same as userRoutes

// ✅ Handle unknown routes
app.use((req, res) => {
  console.warn("404 - Route not found:", req.method, req.url);
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
