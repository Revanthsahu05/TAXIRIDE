import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { captaindatacontext } from "../context/Captaincontext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const { captain, setCaptain } = useContext(captaindatacontext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }
    // const fetchProfile = async () => {
    //   try {
    //     // const response = await axios.get(
    //     //   `${import.meta.env.VITE_BASE_URL}/captain/profile`,
    //     //   {
    //     //     headers: {
    //     //       Authorization: `Bearer ${token}`,
    //     //     },
    //     //   }
    //     // );
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_BASE_URL}/captain/profile`
    //     );
    //     setCaptain(response.data.captain);
    //     console.log("Captain Profile:", response.data.captain);
    //   } catch (err) {
    //     console.log("Error fetching captain profile:", err);
    //     localStorage.removeItem("token");
    //     navigate("/captain-login");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    const fetchProfile = async () => {
      if (!token) {
        console.log("No token found in localStorage");
        navigate("/captain-login");
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        setCaptain(response.data.captain);
      } catch (err) {
        console.log(
          "Error fetching captain profile:",
          err.response?.data || err
        );
        localStorage.removeItem("token");
        navigate("/captain-login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, token, setCaptain]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default CaptainProtectWrapper;
