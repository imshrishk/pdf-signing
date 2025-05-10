import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/notifications`, {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleNavigation = (path) => () => navigate(path);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Notifications</h1>
      <p>
        Welcome, {user.name} ({user.email})
      </p>

      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications at the moment.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <h3>{notification.title}</h3>
              <p>{notification.details}</p>
              <small>Sent at: {formatDate(notification.createdAt)}</small>
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <button onClick={handleNavigation("/")}>Dashboard</button>
        <button onClick={handleNavigation("/workouts")}>Workouts</button>
        <button onClick={handleNavigation("/joinclan")}>Join Clan</button>
        <button onClick={handleNavigation("/viewClans")}>View Clans</button>
        <button onClick={handleNavigation("/createClan")}>Create Clan</button>
      </div>
    </div>
  );
};

export default Notifications;
