import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Userdatacontext } from "../context/Usercontext";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const { user, setuser } = useContext(Userdatacontext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`
        );
        setuser(response.data.user);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching user profile:", err);
        localStorage.removeItem("token"); // Cleanup just in case
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate, setuser]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default UserProtectWrapper;
