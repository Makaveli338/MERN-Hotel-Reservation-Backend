const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const bookingsRoutes = require("./routes/booking.routes");
const userRoutes = require("./routes/user.routes");

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Mount routes
app.use("/api/bookings", bookingsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes); // Add this line

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;