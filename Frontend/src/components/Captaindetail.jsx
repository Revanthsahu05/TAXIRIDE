
import React, { useContext } from "react";
import { captaindatacontext } from "../context/Captaincontext";

const Captaindetail = () => {
  const { captain } = useContext(captaindatacontext);

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      {/* Captain Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
            src="https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg"
            alt="Captain Avatar"
          />
          <div>
            <h4 className="text-xl font-semibold capitalize text-gray-800">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className="text-sm text-gray-500">Captain</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-base font-bold text-green-600">₹{(captain?.earnings?.total || 0).toFixed(2)}</h4>
          <p className="text-sm text-gray-500">Total Earned</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg text-center">
        <div>
          <i className="ri-steering-2-line text-2xl text-blue-600"></i>
          <h5 className="text-sm font-semibold mt-1">{captain?.rides?.total || 0}</h5>
          <p className="text-xs text-gray-600">Rides</p>
        </div>
        <div>
          <i className="ri-wallet-3-line text-2xl text-green-600"></i>
          <h5 className="text-sm font-semibold mt-1">₹{(captain?.earnings?.today || 0).toFixed(2)}</h5>
          <p className="text-xs text-gray-600">Today</p>
        </div>
        <div>
          <i className="ri-wallet-3-line text-2xl text-yellow-600"></i>
          <h5 className="text-sm font-semibold mt-1">₹{(captain?.earnings?.monthly || 0).toFixed(2)}</h5>
          <p className="text-xs text-gray-600">This Month</p>
        </div>
        <div>
          <i className="ri-star-smile-line text-2xl text-purple-600"></i>
          <h5 className="text-sm font-semibold mt-1">{(captain?.ratings?.average || 0).toFixed(2)}</h5>
          <p className="text-xs text-gray-600">Avg Rating</p>
        </div>
      </div>
    </div>
  );
};

export default Captaindetail;
