// import React, { useContext } from "react";
// import { captaindatacontext } from "../context/Captaincontext";
// const Captaindetail = () => {
//   const { captain } = useContext(captaindatacontext);
//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center justify-start gap-3">
//           <img
//             className="w-10 h-10 rounded-full object-cover"
//             src="https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg"
//             alt=""
//           />
//           <h4 className="text-lg font-medium capitalize">{captain.fullname.firstname+" "+captain.fullname.lastname}</h4>
//         </div>
//         <div>
//           <h4 className="font-semibold text-xl">295.20rs</h4>
//           <p className="text-sm font-medium text-gray-600">Earned</p>
//         </div>
//       </div>
//       <div className="flex p-3 mt-6 bg-gray-100 rounded-sm justify-center items-start gap-5">
//         <div className="text-center">
//           <i className="text-2xl font-thin ri-time-line"></i>
//           <h5 className="text-lg font-medium">10.2</h5>
//           <p className="text-sm text-gray-600">Hours Online</p>
//         </div>
//         <div className="text-center">
//           <i className="text-2xl font-thin ri-speed-up-fill"></i>
//           <h5 className="text-lg font-medium">10.2</h5>
//           <p className="text-sm text-gray-600">Hours Online</p>
//         </div>
//         <div className="text-center">
//           <i className="text-2xl font-thin ri-booklet-line"></i>
//           <h5 className="text-lg font-medium">10.2</h5>
//           <p className="text-sm text-gray-600">Hours Online</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Captaindetail;
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
          <h4 className="text-lg font-bold text-green-600">₹295.20</h4>
          <p className="text-sm text-gray-500">Total Earned</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg text-center">
        <div>
          <i className="ri-steering-2-line text-2xl text-blue-600"></i>
          <h5 className="text-lg font-semibold mt-1">15</h5>
          <p className="text-sm text-gray-600">Rides </p>
        </div>
        <div>
          <i className="ri-wallet-3-line text-2xl text-yellow-600"></i>
          <h5 className="text-lg font-semibold mt-1">₹1,240</h5>
          <p className="text-sm text-gray-600">This Month</p>
        </div>
        <div>
          <i className="ri-star-smile-line text-2xl text-purple-600"></i>
          <h5 className="text-lg font-semibold mt-1">4.8</h5>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>
    </div>
  );
};

export default Captaindetail;
