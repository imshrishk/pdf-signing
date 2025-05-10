const { getUser } = require("../services/userServiceToken");
const User = require("../models/userModel");

function restrictToLoggedInUsersOnly(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
}

function checkAuth(req, res, next) {
  const token = req.cookies?.uid;

  if (token) {
    const user = getUser(token);
    if (user) {
      req.user = user;
    }
  }

  next();
}

function isAdmin(req, res, next) {
  const token = req.cookies?.uid;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = getUser(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({ error: "Invalid token" });
  }

  User.findById(decoded.id)
    .then((user) => {
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error("Error verifying admin status:", err);
      res.status(500).json({ error: "Server error" });
    });
}
module.exports = { restrictToLoggedInUsersOnly, checkAuth, isAdmin };
