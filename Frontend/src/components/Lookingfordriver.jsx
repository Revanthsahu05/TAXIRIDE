import React from 'react'

const Lookingfordriver = (props) => {
  return (
    <div className="p-4">
      <h3 className="p-1 text-center w-[81%] absolute top-0">
        <i
          className="ri-arrow-down-wide-line absolute top-0 left-1/2 text-2xl font-semibold opacity-30"
          onClick={() => {
            props.setvechilef(false);
            props.setcrpanel(true);
          }}
        ></i>
      </h3>
      <h3 className="font-medium text-xl mb-3">Looking For a Driver</h3>
      <div className="flex flex-col items-center justify-center gap-3 pt-5">
        <img
          className="h-20 w-30"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png"
          alt=""
        />
        <div className="w-full flex items-center">
          <i className="ri-map-pin-user-fill text-2xl mr-3"></i>
          <div>
            <h3 className="font-semibold">562/11-A</h3>
            <p className="text-gray-600">Kankariya Talab, Bengaluru</p>
          </div>
        </div>
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
    </div>
  );
}

export default Lookingfordriver
