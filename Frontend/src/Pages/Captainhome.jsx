import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import Captaindetail from '../components/Captaindetail';
import axios from 'axios';
import Ridepopup from '../components/Ridepopup';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import { useState, useRef } from 'react';
import { useContext } from 'react';
import Confirmridepopup from '../components/Confirmridepopup';
import { SocketContext } from '../context/Socketcontext';
import { captaindatacontext } from '../context/Captaincontext';
import { useNavigate } from 'react-router-dom';
import Livetracking from '../components/Livetracking';
const Captainhome = () => {
  const [ridepopup, setridepopup] = useState(false)
  const [confirmridepopup, setconfirmridepopup] = useState(false)
  const ridepopupref = useRef(null)
  const cridepopupref = useRef(null)
  const { socket, sendmessage, recievemessage } = useContext(SocketContext);
  const { captain, ride, setride } = useContext(captaindatacontext)
  const navigate = useNavigate();
  useEffect(() => {
    sendmessage('join', { usertype: 'captain', userid: captain._id })
    const updatelocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit('update-location-captain', {
            captainid: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }
    const locationinterval = setInterval(updatelocation, 1000)
    return () => { clearInterval(locationinterval) }
  })
  useEffect(() => {
    socket.on("new-ride", (data) => {
      setride(data);
      setridepopup(true);
    });
  }, []);
  useEffect(() => {
    const handleRideCancelled = (ride) => {
      navigate("/cancelride", { state: { ride } });
    };
    socket.on("ridecancelled", handleRideCancelled);
  }, []);

  async function confirmride() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/confirmride`,
        {
          rideid: ride._id,
          captainid: captain._id,
        }
      );
      setridepopup(false);
      setconfirmridepopup(true);
    } catch (error) {
      console.error(
        "Authorization failed:",
        error.response?.data || error.message
      );
      navigate('/cancelride')
    }
  }

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captain/logout`
      );

      if (response.status === 200) {
        navigate("/captain-login");
      }
    } catch (err) {
      console.log("Logout failed:", err.message);
    }
  };
  useGSAP(
    function () {
      if (ridepopup) {
        gsap.to(ridepopupref.current, {
          translateY: 0,
        });
      } else {
        gsap.to(ridepopupref.current, {
          translateY: "100%",
        });
      }
    },
    [ridepopup]
  );
  useGSAP(
    function () {
      if (confirmridepopup) {
        gsap.to(cridepopupref.current, {
          translateY: 0,
        });
      } else {
        gsap.to(cridepopupref.current, {
          translateY: "100%",
        });
      }
    },
    [confirmridepopup]
  );

  return (
    <div>
      <div className="h-screen">
        <div className="fixed p-6 top-0 flex items-center justify-between w-full z-50 pointer-events-none">
          {/* Logout button at top-left - pointer-events-auto needed because parent is none */}
          <div className={`flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md pointer-events-auto cursor-pointer ${confirmridepopup ? 'hidden' : ''}`} onClick={handleLogout}>
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </div>
        </div>
        <div className="h-4/6 overflow-hidden">
          {/* <img
            className="h-full w-full object-cover"
            src="https://s.wsj.net/public/resources/images/BN-XR452_201802_M_20180228165525.gif"
            alt=""
          /> */}
          <Livetracking />
        </div>
        <div className="h-2/6 p-4">
          <Captaindetail />
        </div>
        <div
          ref={ridepopupref}
          className="translate-y-full fixed w-full bg-white z-10 bottom-0 px-3 py-6"
        >
          <Ridepopup
            ride={ride}
            setridepopup={setridepopup}
            setconfirmridepopup={setconfirmridepopup}
            confirmride={confirmride}
          />
        </div>
        <div
          ref={cridepopupref}
          className="translate-y-full h-screen fixed w-full bg-white z-10 bottom-0 px-3 py-6"
        >
          <Confirmridepopup
            ride={ride}
            setconfirmridepopup={setconfirmridepopup}
            setridepopup={setridepopup}
          />
        </div>
      </div>
    </div>
  );
}

export default Captainhome
