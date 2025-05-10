import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { URL } from "../url";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError(
        error.response?.data?.error ||
          "An error occurred during login. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <h3>Don't have an account?</h3>
      <button type="button" onClick={() => navigate("/signup")}>
        Sign Up
      </button>
      {/* <button type="button" onClick={() => navigate("/admin")}>
        Admin
      </button> */}
    </div>
  );
};

export default Login;
