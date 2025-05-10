const express = require("express");
const router = express.Router();
const {
  handleSignUp,
  handleLogin,
  handleSignOut,
  deleteUser,
  verifyToken,
  fetchAllUsers,
  getUsername,
} = require("../controllers/userControllers");

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleSignOut);
router.post("/deleteUser", deleteUser);
router.post("/getUsername", getUsername);
router.get("/verify-token", verifyToken);
router.get("/fetchAllUsers", fetchAllUsers);

module.exports = router;
