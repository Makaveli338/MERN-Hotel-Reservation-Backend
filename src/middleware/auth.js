// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function(requiredRole) {
  return function(req, res, next) {
    console.log("DEBUG - Required role for this route:", requiredRole);
    console.log("DEBUG - Incoming Authorization header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("DEBUG - Missing or malformed Authorization header");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("DEBUG - Extracted token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DEBUG - Decoded JWT payload:", decoded);

      req.user = decoded; // { id, role, iat, exp }

      // Role check
      if (requiredRole && req.user.role !== requiredRole) {
        console.log(
          `DEBUG - Role mismatch. Required: ${requiredRole}, but user role is: ${req.user.role}`
        );
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.log("DEBUG - Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
