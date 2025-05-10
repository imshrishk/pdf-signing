import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../url"; // Assuming URL is defined in this module

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedClans, setSelectedClans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleView();
  }, []);

  const handleView = async () => {
    try {
      const response = await axios.get(
        `${URL}/auth/fetchAllUsers`,
        {},
        { withCredentials: true }
      );
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleViewClans = (clanNames) => {
    setSelectedClans(clanNames);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedClans([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          User Details
        </h1>
        {users.length > 0 ? (
          <div className="mt-6 overflow-x-auto w-full">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg mx-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border-b">User ID</th>
                  <th className="px-4 py-2 text-left border-b">Name</th>
                  <th className="px-4 py-2 text-left border-b">Email</th>
                  <th className="px-4 py-2 text-left border-b">Created At</th>
                  <th className="px-4 py-2 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">
                      {user._id.toString()}
                    </td>
                    <td className="px-4 py-2 border-b">{user.name}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleViewClans(user.clans.clanNames)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        View Clans
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No users found.</p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold mb-4">Clan Names</h2>
            <ul className="list-disc pl-5 space-y-2">
              {selectedClans.map((clan, index) => (
                <li key={index}>{clan}</li>
              ))}
            </ul>
            <button
              onClick={closePopup}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
