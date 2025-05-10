import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../url";

function ViewClans() {
  const [clanNames, setClanNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClans();
  }, []);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/viewClans/user`);
      setClanNames(response.data);
    } catch (error) {
      console.error("Error fetching clans:", error);
      alert("Failed to fetch clans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewChats = (clanName) => {
    navigate("/clanChat", { state: { clanName } });
  };

  return (
    <div>
      <h2>View Clans</h2>
      {loading ? (
        <p>Loading clans...</p>
      ) : (
        <ul>
          {clanNames.map((clanName, index) => (
            <li key={index}>
              {clanName}
              <button onClick={() => handleViewChats(clanName)}>
                View Chats
              </button>
            </li>
          ))}
        </ul>
      )}
      {!loading && clanNames.length === 0 && <p>No clans found.</p>}
    </div>
  );
}

export default ViewClans;
