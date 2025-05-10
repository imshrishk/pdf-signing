const mongoose = require("mongoose");
const CalorieSchema = require("./CalorieModel").schema; // Embed the Calorie schema

const calorieUserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  nutrition: {
    type: [CalorieSchema],
    default: [] // Set default to an empty array
  }
});

const CalorieUser = mongoose.model("calorieUser", calorieUserSchema);

module.exports = CalorieUser;
