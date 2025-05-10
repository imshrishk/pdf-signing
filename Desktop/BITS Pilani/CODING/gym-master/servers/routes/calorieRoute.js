const express = require("express");
const router = express.Router();
const {
  calorieEntry,
  getCalorie,
  updateCalorie,
  deleteCalorie,
  getUserCaloriesLast24Hours,
  getUserAllNutrition
} = require("../controllers/calorieController");

router.post("/addCalorie", calorieEntry);
router.get("/view-calories", getCalorie);
router.get("/calorie24", getUserCaloriesLast24Hours);
router.get("/userCalories", getUserAllNutrition);

router.patch("/calories/:id", updateCalorie); // Corrected path
router.delete("/calories/:id", deleteCalorie); // Corrected path

module.exports = router;
