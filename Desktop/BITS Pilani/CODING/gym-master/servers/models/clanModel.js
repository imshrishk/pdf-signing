// clanModel.js
const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  clanLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Clan = mongoose.model("Clan", clanSchema);

module.exports = Clan;
