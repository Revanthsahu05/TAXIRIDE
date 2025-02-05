import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Captainlogout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captain/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        if(response.status===200){
            localStorage.removeItem("token");
            navigate('/captain-login')
        }
    } catch (err) {
        console.log("Logout failed:", err.message);
    }
  };
  return (
    <div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Captainlogout;
