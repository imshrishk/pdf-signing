const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const exerciseSchema = require("./exerciseDataModel");

const workoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [exerciseSchema],
});

module.exports = mongoose.model("Workout", workoutSchema);
