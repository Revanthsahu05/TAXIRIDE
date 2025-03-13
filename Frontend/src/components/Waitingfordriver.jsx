import React from 'react'

const Waitingfordriver = (props) => {
  return (
    <div className="p-4">
      <h3 className="p-1 text-center w-[81%] absolute top-0">
        <i
          className="ri-arrow-down-wide-line absolute top-0 left-1/2 text-2xl font-semibold opacity-30"
          onClick={() => {
            props.setwaitingfordriver(false);
          }}
        ></i>
      </h3>
      <div className='flex items-center justify-between'>
        <img
          className="h-10"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png"
          alt=""
        />
        <div className='text-right -mt-1 -mb-1'>
          <h2 className='text-lg font-medium'>Rohan</h2>
          <h4 className='text-xl font-semibold'>AP 02 1496</h4>
          <p className='text-sm text-gray-600'>Lamborghini</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 pt-5">
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

export default Waitingfordriver
