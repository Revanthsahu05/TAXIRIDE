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
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setuser(response.data.user);
      } catch (err) {
        console.log("Error fetching user profile:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, token, setuser]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default UserProtectWrapper;
