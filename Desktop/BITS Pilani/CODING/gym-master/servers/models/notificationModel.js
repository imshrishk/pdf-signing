// clanModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  details: {
    type: String,
    required: true,
    unique: false,
  }
}, {timestamps: true});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;