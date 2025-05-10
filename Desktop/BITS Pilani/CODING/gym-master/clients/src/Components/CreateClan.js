import React, { useState } from "react";
import axios from "axios";
import { URL } from "../url";

function CreateClan() {
  const [clanName, setClanName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setClanName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clanName.trim()) {
      alert("Please enter a clan name");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${URL}/createClan`, { clanName });
      console.log("Clan Created Successfully!");
      alert(`${clanName} created successfully`);
      setClanName("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Clan name already in use");
      } else {
        console.error(error);
        alert("There was an error creating the clan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Clan</h2>
      <input
        type="text"
        value={clanName}
        onChange={handleInputChange}
        placeholder="Enter clan name"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Clan"}
      </button>
    </form>
  );
}

export default CreateClan;
