const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const userRoutes = require("./routes/userRoute");
const homeRoutes = require("./routes/homeRoute");
const connectDB = require("./connect-atlas");
const clanRoutes = require("./routes/clanRoute");
const workoutRoutes = require("./routes/workoutRoutes");
const calorieRoutes = require("./routes/calorieRoute");
const notificationsRoutes = require("./routes/notificationsRoute");
const adminRoutes = require("./routes/adminRoute");
const { URL } = require("./url");
const {
  restrictToLoggedInUsersOnly,
  checkAuth,
  isAdmin,
} = require("./middlewares/auth");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 8000;

connectDB.once("open", () => {
  console.log("MongoDB connection established.");
});

// Middleware setup
app.use(
  cors({
    origin: URL,
    credentials: true,
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Route setup
app.use("/admin", isAdmin, adminRoutes);
app.use("/auth", userRoutes);
app.use("/", checkAuth);
app.use("/", workoutRoutes);
app.use("/", clanRoutes);
app.use("/", homeRoutes);
app.use("/", calorieRoutes);
app.use("/", notificationsRoutes);

// Example middleware to redirect based on authentication
app.get("/", checkAuth, (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  } else {
    return res.redirect("/login");
  }
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");
  io.emit("a user joined");

  socket.on("chat message", (msg) => {
    console.log("Message from client: " + msg);
    io.emit("chat message", msg); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    io.emit("disconnected");
    console.log("User disconnected");
  });
});

// Error handling
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Start server
server.listen(port, () => {
  console.log("Server running on port", port);
});

module.exports = app;
