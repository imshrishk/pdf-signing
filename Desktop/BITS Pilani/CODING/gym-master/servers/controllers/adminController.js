const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

async function postNotifications(req, res) {
  try {
    const notification = new Notification({
      title: req.body.title,
      details: req.body.details,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error posting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getUserCount(req, res) {
  try {
    const userCount = await User.countDocuments({ role: "user" });
    const adminCount = await User.countDocuments({ role: "admin" });
    res.status(200).json({ userCount, adminCount });
  } catch (error) {
    console.error("Error getting user counts:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function fetchAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function promoteToAdmin(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User promoted to admin", user });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function demoteToUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "user" },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Admin demoted to user", user });
  } catch (error) {
    console.error("Error demoting admin to user:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  postNotifications,
  getUserCount,
  deleteNotification,
  promoteToAdmin,
  demoteToUser,
  fetchAllUsers,
  getNotifications,
};
