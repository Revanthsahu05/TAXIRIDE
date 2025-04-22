import React, { useContext } from "react";
import { captaindatacontext } from "../context/Captaincontext";
const Captaindetail = () => {
  const { captain } = useContext(captaindatacontext);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg"
            alt=""
          />
          <h4 className="text-lg font-medium capitalize">{captain.fullname.firstname+" "+captain.fullname.lastname}</h4>
        </div>
        <div>
          <h4 className="font-semibold text-xl">295.20rs</h4>
          <p className="text-sm font-medium text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-6 bg-gray-100 rounded-sm justify-center items-start gap-5">
        <div className="text-center">
          <i className="text-2xl font-thin ri-time-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-2xl font-thin ri-speed-up-fill"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-2xl font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default Captaindetail;
