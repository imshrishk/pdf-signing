const express = require("express");
const router = express.Router();
const {
  postNotifications,
  getUserCount,
  deleteNotification,
  promoteToAdmin,
  demoteToUser,
  fetchAllUsers,
  getNotifications,
} = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/auth");
router.post("/notifications",  postNotifications);
router.delete("/notifications/:id",  deleteNotification);
router.get("/user-counts",   getUserCount);
router.post("/promote/:id",   promoteToAdmin);
router.post("/demote/:id",   demoteToUser);
router.get("/users",   fetchAllUsers);
router.get("/notifications",  getNotifications);

module.exports = router;
