const express = require("express");
const router = express.Router();
const { handleGettingUsers } = require("../controllers/homeController");

router.get("/home", handleGettingUsers);

module.exports = router;
