import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";
const ViewClans = () => {
  const [userClans, setUserClans] = useState([]);
  const [allClans, setAllClans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserClans();
    fetchAllClans();
  }, []);

  const fetchUserClans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/viewClans/user`, {
        withCredentials: true,
      });
      setUserClans(response.data);
    } catch (error) {
      console.error("Error fetching user clans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/viewClans/all`, {
        withCredentials: true,
      });
      setAllClans(response.data);
    } catch (error) {
      console.error("Error fetching all clans:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = async (clanId, type) => {
    try {
      let updatedClans = [];
      if (type === "user") {
        updatedClans = userClans.map((clan) => {
          if (clan._id === clanId) {
            return { ...clan, showDetails: !clan.showDetails };
          } else {
            return { ...clan };
          }
        });
        setUserClans(updatedClans);
      } else {
        updatedClans = allClans.map((clan) => {
          if (clan._id === clanId) {
            return { ...clan, showDetails: !clan.showDetails };
          } else {
            return { ...clan };
          }
        });
        setAllClans(updatedClans);
      }
    } catch (error) {
      console.error("Error toggling details:", error);
    }
  };

  return (
    <div>
      <h2>View Clans</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section>
            <h3>All Clans</h3>
            <ul>
              {allClans.map((clan) => (
                <li
                  key={clan._id}
                  onClick={() => toggleDetails(clan._id, "all")}
                >
                  {clan.name}
                  {clan.showDetails && (
                    <ul>
                      <li>
                        <strong>Clan Leader:</strong> {clan.clanLeader.name}
                      </li>
                      <li>
                        <strong>Members:</strong>
                        <ul>
                          {clan.members.map((member, index) => (
                            <li key={index}>{member.name}</li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default ViewClans;
