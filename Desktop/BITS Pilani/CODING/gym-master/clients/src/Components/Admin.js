import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const NotificationSection = ({
  notifications,
  notifTitle,
  notifDetails,
  setNotifTitle,
  setNotifDetails,
  handlePostNotification,
  handleNotificationDelete,
  loading,
}) => (
  <div>
    <h3>Post New Notification</h3>
    <input
      type="text"
      placeholder="Notification Title"
      value={notifTitle}
      onChange={(e) => setNotifTitle(e.target.value)}
    />
    <textarea
      placeholder="Notification Details"
      value={notifDetails}
      onChange={(e) => setNotifDetails(e.target.value)}
    />
    <button onClick={handlePostNotification} disabled={loading}>
      {loading ? "Posting..." : "Post Notification"}
    </button>

    <h3>Current Notifications</h3>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <strong>{notification.title}</strong> - {notification.details}
            <button
              onClick={() => handleNotificationDelete(notification._id)}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const UserManagementSection = ({
  users,
  handlePromoteUser,
  handleDemoteUser,
  loading,
}) => (
  <div>
    <h3>User Management</h3>
    {loading ? (
      <p>Loading users...</p>
    ) : (
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email}) - Role: {user.role}
            {user.role === "user" ? (
              <button
                onClick={() => handlePromoteUser(user._id)}
                disabled={loading}
              >
                Promote to Admin
              </button>
            ) : (
              <button
                onClick={() => handleDemoteUser(user._id)}
                disabled={loading}
              >
                Demote to User
              </button>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDetails, setNotifDetails] = useState("");
  const [userCount, setUserCount] = useState({ users: 0, admins: 0 });
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    } else {
      showNotifications();
      getUserCount();
      fetchUsers();
    }
  }, [user, navigate]);

  const showNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/admin/notifications`, {
        withCredentials: true,
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotification = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${URL}/admin/notifications`,
        { title: notifTitle, details: notifDetails },
        { withCredentials: true }
      );
      showNotifications();
      setNotifTitle("");
      setNotifDetails("");
    } catch (err) {
      console.error("Error posting notification:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${URL}/admin/notifications/${id}`, {
        withCredentials: true,
      });
      showNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    } finally {
      setLoading(false);
    }
  };

  const getUserCount = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/admin/user-counts`, {
        withCredentials: true,
      });
      setUserCount({ users: res.data.userCount, admins: res.data.adminCount });
    } catch (err) {
      console.error("Error fetching user count:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.post(
        `${URL}/admin/promote/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      getUserCount();
    } catch (err) {
      console.error("Error promoting user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.post(
        `${URL}/admin/demote/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      getUserCount();
    } catch (err) {
      console.error("Error demoting user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h3>User Statistics</h3>
      <p>Regular Users: {userCount.users}</p>
      <p>Admins: {userCount.admins}</p>

      <NotificationSection
        notifications={notifications}
        notifTitle={notifTitle}
        notifDetails={notifDetails}
        setNotifTitle={setNotifTitle}
        setNotifDetails={setNotifDetails}
        handlePostNotification={handlePostNotification}
        handleNotificationDelete={handleNotificationDelete}
        loading={loading}
      />

      <UserManagementSection
        users={users}
        handlePromoteUser={handlePromoteUser}
        handleDemoteUser={handleDemoteUser}
        loading={loading}
      />
    </div>
  );
};

export default Admin;
