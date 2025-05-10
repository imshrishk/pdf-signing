import React, { useContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const [, , removeCookie] = useCookies(["uid"]);
  const navigate = useNavigate();

  const handleNavigation = (path) => () => navigate(path);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.post(`${URL}/deleteUser`, {}, { withCredentials: true });
        removeCookie("uid");
        logout();
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <button onClick={handleNavigation("/workouts")}>Workouts</button>
        <button onClick={handleNavigation("/joinclan")}>Join Clan</button>
        <button onClick={handleNavigation("/viewClans")}>
          View Your Clans
        </button>
        <button onClick={handleNavigation("/viewAllClans")}>
          View All Clans
        </button>
        <button onClick={handleNavigation("/createClan")}>Create Clan</button>
        <button onClick={handleNavigation("/add-calorie")}>Add Calorie</button>
        <button onClick={handleNavigation("/notifications")}>
          Notifications
        </button>
        <button type="button" onClick={() => navigate("/admin")}>
        Admin
      </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={logout} style={{ marginRight: "10px" }}>
          Sign Out
        </button>
        <button
          onClick={handleDeleteAccount}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
