const express = require("express");
const router = express.Router();
const {
  displayNotifications,
} = require("../controllers/notificationController");

router.get("/notifications", displayNotifications);

module.exports = router;
