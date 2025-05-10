const express = require("express");
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
} = require("../controllers/workoutController");

router.post("/workouts", createWorkout);
router.get("/workouts", getWorkouts);

module.exports = router;
