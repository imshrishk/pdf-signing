const mongoose = require("mongoose");

const clanUserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  clanIds: {
    type: [String],
    default: [],
  },
  clanNames: {
    type: [String],
    default: [],
  },
});

const ClanUser = mongoose.model("ClanUser", clanUserSchema);

module.exports = ClanUser;
