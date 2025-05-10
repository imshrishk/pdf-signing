const Workout = require("../models/workoutDataModel");

async function createWorkout(req, res) {
  console.log("in createWorkout");
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { exercises, user } = req.body;
    const newWorkout = new Workout({
      user,
      exercises,
      date: new Date(), // add current date to the workout document
    });
    console.log("in createWorkout1");
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.log("in createWorkout2");
    res.status(500).json({ message: error.message });
  }
}

async function getWorkouts(req, res) {
  try {
    console.log("in getWorkout");
    const userId = req.user.id;
    const workouts = await Workout.find({ user: userId }).sort({ date: -1 });
    const workoutsByDate = {};
    workouts.forEach((workout) => {
      const date = workout.date.toISOString().split("T")[0];
      if (!workoutsByDate[date]) {
        workoutsByDate[date] = [];
      }
      workoutsByDate[date].push(workout);
    });
    const workoutsArray = Object.values(workoutsByDate);
    res.status(200).json(workoutsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getWorkouts,
  createWorkout,
};
