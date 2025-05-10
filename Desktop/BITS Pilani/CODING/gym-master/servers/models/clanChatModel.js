const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define ClanChat Schema
const ClanChatSchema = new mongoose.Schema({
  clanName: {
    type: String,
    required: true,
    unique:true
  },
  messages: [MessageSchema], // Array of messages using MessageSchema
});

// Compile model from schema
const ClanChat = mongoose.model("ClanChat", ClanChatSchema);

module.exports = ClanChat;
