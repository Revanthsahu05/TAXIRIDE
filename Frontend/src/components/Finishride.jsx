import React from 'react'
import { Link } from "react-router-dom";
const Finishride = (props) => {
  return (
    <div className="p-4">
      <h3 className="p-1 text-center w-[81%] absolute top-0">
        <i
          className="ri-arrow-down-wide-line absolute top-0 text-2xl font-semibold opacity-30"
          onClick={() => props.setFinishridepanel(false)}
        ></i>
      </h3>

      <h3 className="font-medium text-xl mb-3">Finish Ride</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg"
            alt="Profile"
          />
          <h2 className="text-lg font-medium">Harsh Patel</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2km</h5>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 pt-5">
        <div className="w-full flex items-center mb-3">
          <i className="ri-map-pin-user-fill text-2xl mr-3"></i>
          <div>
            <h3 className="font-semibold">562/11-A</h3>
            <p className="text-gray-600">Kankariya Talab, Bengaluru</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 items-center mb-4">
          <div className="w-full flex items-center">
            <i className="ri-map-pin-2-fill text-2xl mr-3"></i>
            <div>
              <h3 className="font-semibold">562/11-A</h3>
              <p className="text-gray-600">Kankariya Talab, Bengaluru</p>
            </div>
          </div>
          <div className="w-full flex items-center">
            <i className="ri-bank-card-fill text-2xl mr-3"></i>
            <div>
              <h3 className="font-semibold">₹193.40</h3>
              <p className="text-gray-600">Total Amount</p>
            </div>
          </div>
        </div>
        <div className="w-full gap-4 flex items-center justify-between mt-7">
          <Link
            to="/captain-home"
            className="w-full text-white flex justify-center bg-green-500 rounded-md font-medium p-2 "
          >
            Complete ride
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Finishride
