const express = require("express");
const controller = require("../controllers/user.controller");

const router = express.Router();

// GET /api/users
router.get("/", controller.listUsers);

// GET /api/users/:id
router.get("/:id", controller.getUser);

// POST /api/users 
router.post("/", controller.createUser);

// Alias for user registration
router.post("/register", controller.createUser);


// Login route
router.post("/login", controller.loginUser);

module.exports = router;
