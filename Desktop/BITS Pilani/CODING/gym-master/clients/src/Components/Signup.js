import React, { useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${URL}/auth/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign up:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Signup failed. Please try again."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
