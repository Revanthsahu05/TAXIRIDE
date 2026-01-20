import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { captaindatacontext } from "../context/Captaincontext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const { captain, setCaptain } = useContext(captaindatacontext);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/profile`
        );
        setCaptain(response.data.captain);
        setIsLoading(false);
        if (!response.data.captain.vechile?.color && location.pathname !== '/captain-vehicle-info') {
          navigate('/captain-vehicle-info')
        }
      } catch (err) {
        console.log(
          "Error fetching captain profile:",
          err.response?.data || err
        );
        localStorage.removeItem("token"); // Cleanup just in case
        navigate("/captain-login");
      }
    };
    fetchProfile();
  }, [navigate, setCaptain]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default CaptainProtectWrapper;
