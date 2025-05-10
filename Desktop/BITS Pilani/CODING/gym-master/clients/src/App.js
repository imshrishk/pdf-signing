import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Home from "./Components/Home"; // Changed to Components
import AddWorkout from "./Components/AddWorkout"; // Changed to Components
import ViewWorkouts from "./Components/ViewWorkouts"; // Changed to Components
import ViewClans from "./Components/ViewClans"; // Changed to Components
import ViewUsers from "./Components/ViewUsers"; // Changed to Components

import ViewAllClans from "./Components/ViewAllClan"; // Changed to Components
import JoinClan from "./Components/JoinClan"; // Changed to Components
import CreateClan from "./Components/CreateClan"; // Changed to Components
import ClanChat from "./Components/ClanChat"; // Added from ali
import { UserProvider } from "./UserContext";
import PrivateRoute from "./Components/PrivateRoute"; // Changed to Components
import CalorieTracker from "./Components/Calorietracker";
import viewNutrition from "./Components/ViewNutrition";

import axios from "axios";

import Notifications from "./Components/Notifications";
import Admin from "./Components/Admin";
import "./App.css";
import "./Basic.css";
import ViewNutrition from "./Components/ViewNutrition";

axios.defaults.withCredentials = true; // Allows cookies to be sent by default in axios req body

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <main>
            <Routes>
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Admin />
                  </PrivateRoute>
                }
              />
              <Route path="/viewUsers" element={<ViewUsers />} />

              {/* Private Routes */}
              <Route
                path="/workouts"
                element={
                  <PrivateRoute>
                    <AddWorkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewWorkouts"
                element={
                  <PrivateRoute>
                    <ViewWorkouts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-calorie"
                element={
                  <PrivateRoute>
                    <CalorieTracker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/view-calories"
                element={
                  <PrivateRoute>
                    <CalorieTracker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewNutrition"
                element={
                  <PrivateRoute>
                    <ViewNutrition />
                  </PrivateRoute>
                }
              />

              <Route
                path="/createClan"
                element={
                  <PrivateRoute>
                    <CreateClan />
                  </PrivateRoute>
                }
              />
              <Route
                path="/joinClan"
                element={
                  <PrivateRoute>
                    <JoinClan />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewAllClans"
                element={
                  <PrivateRoute>
                    <ViewAllClans />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewClans"
                element={
                  <PrivateRoute>
                    <ViewClans />
                  </PrivateRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />
              {/* Public Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/clanChat" element={<ClanChat />} />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
