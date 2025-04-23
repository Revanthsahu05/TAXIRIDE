import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import Captaindetail from '../components/Captaindetail';
import axios from 'axios';
import Ridepopup from '../components/Ridepopup';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import { useState,useRef } from 'react';
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
   const cridepopupref=useRef(null)
   const { socket,sendmessage, recievemessage } = useContext(SocketContext);
    const { captain,ride,setride } = useContext(captaindatacontext)
    const navigate = useNavigate();
   useEffect(()=>{
      sendmessage('join',{usertype:'captain',userid:captain._id})
      const updatelocation=()=>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('update-location-captain',{
              captainid:captain._id,
              location:{
                ltd:position.coords.latitude,
                lng:position.coords.longitude
              }
            })
          })
        }
      }
      const locationinterval=setInterval(updatelocation,1000)
      return ()=>{clearInterval(locationinterval)}
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
    // async function confirmride(){
    //   const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/confirmride`,{

    //   })
    //   setridepopup(false)
    //   setconfirmridepopup(true)
    // }
    async function confirmride() {
      const token = localStorage.getItem("token"); // Or however you're storing the JWT
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/ride/confirmride`,
          {
            rideid: ride._id,
            captainid: captain._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/captain/logout`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            localStorage.removeItem("token");
            navigate("/login");
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
        <div className="fixed p-3 top-0 flex items-center justify-start w-full">
          <img
            className="h-10 w-10"
            src="data:image/png;base64,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"
            alt=""
          />
          <button
            onClick={handleLogout}
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full z-50"
          >
            <i className=" text-lg font-medium ri-logout-box-r-line"></i>
          </button>
        </div>
        <div className="h-4/6 overflow-hidden">
          {/* <img
            className="h-full w-full object-cover"
            src="https://s.wsj.net/public/resources/images/BN-XR452_201802_M_20180228165525.gif"
            alt=""
          /> */}
          <Livetracking/>
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
