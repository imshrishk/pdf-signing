import React, { useState } from "react";
import axios from "axios";
import { URL } from "../url";

function JoinClan() {
  const [clanName, setClanName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setClanName(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clanName.trim()) {
      alert("Please enter a clan name");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${URL}/joinClan`, { clanName });
      alert("Clan Joined Successfully");
      setClanName("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("No Such Clan Found");
      } else {
        console.error(error);
        alert("There was an error joining the clan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join Clan</h2>
      <input
        type="text"
        value={clanName}
        onChange={handleInputChange}
        placeholder="Enter clan name"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Joining..." : "Join Clan"}
      </button>
    </form>
  );
}

export default JoinClan;
