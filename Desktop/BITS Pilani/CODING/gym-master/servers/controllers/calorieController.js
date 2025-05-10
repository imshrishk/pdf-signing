const Calorie = require("../models/CalorieModel"); // Make sure this matches your model
const CalorieUser = require("../models/calorieUserModel"); // Adjust path if needed

async function calorieEntry(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = req.user.id;

    // Find the user document in the calorieUser collection
    const user = await CalorieUser.findOneAndUpdate(
      { uid: userId },
      { $setOnInsert: { uid: userId, nutrition: [] } }, // Set initial values if creating
      { new: true, upsert: true } // Create if not exists, return the new doc
    );
        
    if (!user) {
      return res.status(404).json({ message: "User not tracked" });
    }

    // Create a new calorie entry
    const newCalorie = new Calorie(req.body);

    // Add the new calorie entry to the user's nutrition array
    user.nutrition.push(newCalorie);

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


async function getUserCaloriesLast24Hours(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = req.user.id;
    // Find the user by uid
    const user = await CalorieUser.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the time 24 hours ago from now
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Filter the nutrition array for entries within the last 24 hours
    const recentCalories = user.nutrition.filter(entry => entry.timeOfMeal >= twentyFourHoursAgo);

    res.status(200).json(recentCalories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUserAllNutrition(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = req.user.id;
    // Find the user by uid
    const user = await CalorieUser.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve all nutrition entries
    const allNutrition = user.nutrition;

    res.status(200).json(allNutrition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// Get all calorie items
async function getCalorie(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const calories = await Calorie.find();
    res.json(calories);
  } catch (err) {
    console.error("Error fetching calories:", err.message);
    res.status(500).json({ message: err.message });
  }
}

// Update a calorie item
async function updateCalorie(req, res) {
  try {
    const updatedCalorie = await Calorie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCalorie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete a calorie item
async function deleteCalorie(req, res) {
  try {
    await Calorie.findByIdAndDelete(req.params.id);
    res.json({ message: "Calorie entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  calorieEntry,
  getCalorie,
  updateCalorie,
  deleteCalorie,
  getUserCaloriesLast24Hours,
  getUserAllNutrition
};
