const express = require("express");
const router = express.Router();
const {
  joinClan,
  createClan,
  viewClans,
  viewAllClans,
  clanChats,
  sendMessage,
  viewClanMembers,
  fetchAllClans
} = require("../controllers/clanController");

router.get("/joinClan", (req, res) => {
  return res.render("joinClan");
});

router.post("/joinClan", joinClan);

router.get("/createClan", (req, res) => {
  return res.render("createClan");
});

router.post("/createClan", createClan);

router.get("/viewClans/all", viewAllClans);

router.get("/viewClans/user", viewClans);

router.post("/clanChat", clanChats)

router.post("/sendMessage", sendMessage)

router.post("/viewClanMembers", viewClanMembers)
router.post("/fetchAllClansAdmin", fetchAllClans)


module.exports = router;