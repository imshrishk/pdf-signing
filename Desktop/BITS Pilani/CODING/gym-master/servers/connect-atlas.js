const mongoose = require("mongoose");
require("dotenv").config();
// MongoDB connection string
const uri = process.env.UR;

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas.");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

module.exports = mongoose.connection;
