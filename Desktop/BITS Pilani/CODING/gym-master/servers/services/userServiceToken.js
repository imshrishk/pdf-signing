const jwt = require("jsonwebtoken");

function setUser(user) {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
}

function getUser(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

module.exports = { setUser, getUser };
