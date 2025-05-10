const Notification = require("../models/notificationModel");

async function displayNotifications(req, res) {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    if (!notifications.length) {
      return res.status(204).json({ message: "No notifications found" }); // 204 for no content
    }

    res.status(200).json(notifications); // Changed status code to 200 for successful GET request
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
}

module.exports = { displayNotifications };
