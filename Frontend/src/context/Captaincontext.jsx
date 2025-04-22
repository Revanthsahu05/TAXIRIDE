import React, { createContext, useState } from "react";

export const captaindatacontext = createContext();

const CaptainContext = ({ children }) => {
  const [ride, setride] = useState({})
  const [captain, setCaptain] = useState({
    fullname: {
      firstname: "",
      lastname: "",
    },
    email: "",
    socketId: "",
    status: "",
    vechile: {
      color: "",
      Plate: "",
      capacity:"",
      vechiletype: "",
    },
    location: {
      lat: null,
      lng: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = (data) => {
    setCaptain((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <captaindatacontext.Provider
      value={{
        ride,
        setride,
        captain,
        setCaptain,
        loading,
        setLoading,
        error,
        setError,
        updateCaptain,
      }}
    >
      {children}
    </captaindatacontext.Provider>
  );
};

export default CaptainContext;
