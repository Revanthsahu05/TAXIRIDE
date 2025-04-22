import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Confirmridepopup = (props) => {
  const navigate=useNavigate()
   const [OTP, setOTP] = useState('')
  const submithandler=async(e)=>{
    e.preventDefault();
    try{
       const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/startride`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      },
      params:{
        rideid:props.ride._id,
        otp:OTP
      }
    })
    if(response.status===200){
      props.setconfirmridepopup(false)
      props.setridepopup(false)
      // console.log(response.data)
      navigate('/captainriding')
    }
    else{
      alert('Invalid OTP')
    }
    }catch(error){
      // console.log(error.response.data.message)
      alert('Invalid OTP')
    }
  }
  return (
    <div className="p-4">
      <h3 className="p-1 text-center w-[81%] absolute top-0">
        <i
          className="ri-arrow-down-wide-line absolute top-0 text-2xl font-semibold opacity-30"
          onClick={() => props.setconfirmridepopup(false)}
        ></i>
      </h3>

      <h3 className="font-medium text-xl mb-3">Confirm Ride and Start</h3>

      <div className="flex items-center justify-between mb-4 rounded-md border-red-300 p-3 border-2">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg"
            alt="Profile"
          />
          <h2 className="text-lg font-medium">
            {props.ride?.user?.fullname?.firstname +
              " " +
              props.ride?.user?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">{props.ride?.distance} km</h5>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 pt-5">
        <div className="w-full flex items-center mb-3">
          <i className="ri-map-pin-user-fill text-2xl mr-3"></i>
          <div>
            <h3 className="font-semibold">PICK UP</h3>
            <p className="text-gray-600">{props.ride?.pickup}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 items-center mb-4">
          <div className="w-full flex items-center">
            <i className="ri-map-pin-2-fill text-2xl mr-3"></i>
            <div>
              <h3 className="font-semibold">DESTINATION</h3>
              <p className="text-gray-600">{props.ride?.drop}</p>
            </div>
          </div>
          <div className="w-full flex items-center">
            <i className="ri-bank-card-fill text-2xl mr-3"></i>
            <div>
              <h3 className="font-semibold">₹{props.ride?.fare}</h3>
              <p className="text-gray-600">Total Amount</p>
            </div>
          </div>
        </div>
        <form onSubmit={submithandler}>
          <input
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            className="p-1  text-lg rounded-md font-medium"
            type="text"
            placeholder="Enter OTP"
          />
          <div className="w-full gap-4 flex items-center justify-between mt-7">
            <button
              type="submit"
              className="w-full text-white flex justify-center bg-green-500 rounded-md font-medium p-2"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                props.setconfirmridepopup(false);
                props.setridepopup(false);
              }}
              className="w-full text-white bg-red-500 rounded-md font-medium p-2"
            >
              Reject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Confirmridepopup;
