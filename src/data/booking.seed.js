const mongoose = require("mongoose");
const Booking = require("../models/Booking");
require("dotenv").config();

const bookings = [
  {
    guestName: "John Doe",
    checkInDate: "2025-08-14",
    checkOutDate: "2025-08-18",
    guests: 2,
    status: "Pending",
  },
  {
    guestName: "Jane Smith",
    checkInDate: "2025-08-20",
    checkOutDate: "2025-08-25",
    guests: 4,
    status: "Approved",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Booking.deleteMany(); // Clear old data
    await Booking.insertMany(bookings); // Insert new data
    console.log("✅ Database seeded!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
