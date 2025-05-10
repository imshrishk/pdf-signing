const mongoose = require("mongoose");

// MongoDB connection string for local MongoDB instance
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gym";

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to local MongoDB instance
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to local MongoDB.");
  })
  .catch((error) => {
    console.error("Local MongoDB connection error:", error);
  });

module.exports = mongoose.connection;
