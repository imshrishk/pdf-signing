const { getUser } = require("../services/userServiceToken");

async function handleGettingUsers(req, res) {
  try {
    const token = req.cookies?.uid;
    if (!token) {
      console.log("No token found in cookies.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = getUser(token);
    if (!user) {
      console.log("Token verification failed.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("User found:", user);
    res.json({ user });
  } catch (error) {
    console.error("Error during home route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { handleGettingUsers };
