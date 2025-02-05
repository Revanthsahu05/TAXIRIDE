import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Userlogout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.log("Logout failed:", err.message);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Userlogout;
