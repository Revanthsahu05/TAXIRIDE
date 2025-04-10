import React from "react";
import { Link } from "react-router-dom";
const Riding = () => {
  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed  right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i class=" text-lg font-medium ri-home-4-line"></i>
      </Link>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://s.wsj.net/public/resources/images/BN-XR452_201802_M_20180228165525.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-4">
        <div className="flex items-center justify-between">
          <img
            className="h-10"
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png"
            alt=""
          />
          <div className="text-right -mt-1 -mb-1">
            <h2 className="text-lg font-medium">Rohan</h2>
            <h4 className="text-xl font-semibold">AP 02 1496</h4>
            <p className="text-sm text-gray-600">Lamborghini</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <div className="w-full flex flex-col gap-5 items-center">
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
        </div>
        <button className="w-full text-white bg-yellow-500 rounded-sm font-medium p-1">
          Pay
        </button>
      </div>
    </div>
  );
};
export default Riding;
