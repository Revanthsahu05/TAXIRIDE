import React from "react";
import home from "../assets/home.png";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <img
        className="m-5"
        src={home}
        alt="Taxi service homepage illustration"
      />
      <div className="bg-black text-white flex flex-col items-center justify-center gap-4 p-2">
        <div className="text-xl font-medium w-full flex items-center justify-center">
          {/* Get Started with Taxi */}
          Ride Your Way ,Anytime ,Anywhere
        </div>
        <Link
          to="/login"
          className="bg-yellow-400 rounded-md p-1.5 px-4 font-medium w-full flex items-center justify-center m-4"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Home;
