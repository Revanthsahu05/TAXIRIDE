import React, { useEffect } from "react";
import Userlogout from "./Userlogout";
import { useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import Locationsearchpanel from "../components/Locationsearchpanel";
import Vechilepanel from "../components/Vechilepanel";
import Confirmridpanel from "../components/Confirmridpanel";
import Lookingfordriver from "../components/Lookingfordriver";
import Waitingfordriver from "../components/Waitingfordriver";
import { SocketContext } from "../context/Socketcontext";
import { Userdatacontext } from "../context/Usercontext";
import { Socket } from "socket.io-client";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RideCompletedPage from "./RideCompletedPage";
import Livetracking from "../components/Livetracking";
const Home = () => {
  const [pickup, setpickup] = useState("");
  const [destination, setdestination] = useState("");
  const [panel, setpanel] = useState(false);
  const panelref = useRef(null);
  const closepanel = useRef(null);
  const vechilepanelref = useRef(null);
  const [vechilepanel, setvechilepanel] = useState(false);
  const [overf, setoverf] = useState(false);
  const [crpanel, setcrpanel] = useState(false);
  const [vechilef, setvechilef] = useState(false);
  const crref = useRef(null);
  const vechilefref = useRef(null);
  const Waitingfordriverref = useRef(null);
  const [waitingfordriver, setwaitingfordriver] = useState(false);
  const [pickupsuggestions, setPickupsuggestions] = useState([]);
  const [destinationsuggestions, setdestinationsuggestions] = useState([]);
  const [activefield, setactivefield] = useState(null);
  const [fare, setfare] = useState({});
  const [success, setsuccess] = useState(null);
  const [vechiletype, setvechiletype] = useState(null);
  const [amt, setamt] = useState(null);
  const { sendmessage, recievemessage, socket } = useContext(SocketContext);
  const { user, ridedata, setridedata } = useContext(Userdatacontext);
  const navigate = useNavigate();

  useEffect(() => {
    sendmessage("join", { usertype: "user", userid: user._id });
  }, [user]);

  socket.on("rideconfirmed", (ride) => {
    setridedata(ride);
    // localStorage.setItem("rideId", ride._id); // ✅ store ride ID persistently
    setvechilef(false);
    setwaitingfordriver(true);
  });
  useEffect(() => {
    const handleRideCompleted = (ride) => {
      setridedata(ride); // optional if needed
      // localStorage.removeItem("rideId");
      navigate("/ride-completed", { state: { ride } }); // send ride data if needed
    };

    socket.on("ridecompleted", handleRideCompleted);
  }, []);
  useEffect(() => {
    socket.on("ridestarted", (ride) => {
      setwaitingfordriver(false);
      // console.log(ride);
      navigate("/riding");
    });
  }, [navigate, socket]);

  const handleUserLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`);
      navigate('/login');
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  }

  const handlepickupchange = async (e) => {
    setpickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
        }
      );
      if (response.status === 200) {
        setPickupsuggestions(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handledestinationchange = async (e) => {
    setdestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
        }
      );
      if (response.status === 200) {
        setdestinationsuggestions(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const submithandler = (e) => {
    e.preventDefault();
  };
  useGSAP(
    function () {
      if (panel) {
        setoverf(true),
          gsap.to(panelref.current, {
            height: "70%",
            padding: 24,
          });
        gsap.to(closepanel.current, {
          opacity: 1,
        });
      } else {
        setoverf(false),
          gsap.to(panelref.current, {
            height: "0%",
            padding: 0,
          });
        gsap.to(closepanel.current, {
          opacity: 0,
        });
      }
    },
    [panel]
  );
  useGSAP(
    function () {
      if (vechilepanel) {
        gsap.to(vechilepanelref.current, {
          translateY: 0,
        });
      } else {
        gsap.to(vechilepanelref.current, {
          translateY: "100%",
        });
      }
    },
    [vechilepanel]
  );
  useGSAP(
    function () {
      if (crpanel) {
        gsap.to(crref.current, {
          translateY: 0,
        });
      } else {
        gsap.to(crref.current, {
          translateY: "100%",
        });
      }
    },
    [crpanel]
  );
  useGSAP(
    function () {
      if (vechilef) {
        gsap.to(vechilefref.current, {
          translateY: 0,
        });
      } else {
        gsap.to(vechilefref.current, {
          translateY: "100%",
        });
      }
    },
    [vechilef]
  );
  useGSAP(
    function () {
      if (waitingfordriver) {
        gsap.to(Waitingfordriverref.current, {
          translateY: 0,
        });
      } else {
        gsap.to(Waitingfordriverref.current, {
          translateY: "100%",
        });
      }
    },
    [waitingfordriver]
  );
  async function findtrip() {
    setvechilepanel(true);
    setpanel(false);
    try {
      const respone = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/fare`,
        {
          params: {
            pickup: pickup,
            drop: destination,
          },
        }
      );
      if (respone.status === 200) {
        setsuccess(true);
        setfare(respone.data);
      } else {
        setsuccess(false);
        console.log("error in fare calculation");
      }
    } catch (error) {
      setsuccess(false);
      console.log(error.message);
    }
  }
  async function createride() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/ride/create`,
      {
        pickup: pickup,
        drop: destination,
        vechiletype: vechiletype,
      }
    );
    if (response.status === 200) {
      setridedata(response.data);
      localStorage.setItem("rideId", response.data._id);
    }

  }
  const findTripRef = useRef(null);

  useGSAP(
    function () {
      if (vechilepanel) {
        gsap.to(findTripRef.current, {
          transform: "translateY(100%)",
        });
      } else {
        gsap.to(findTripRef.current, {
          transform: "translateY(0%)",
        });
      }
    },
    [vechilepanel]
  );

  return (
    <div
      className={`h-screen relative ${overf ? "overflow-auto" : "overflow-hidden"
        }`}
    >
      <div className="fixed p-6 top-0 flex items-center justify-between w-full z-50 pointer-events-none">
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md pointer-events-auto cursor-pointer" onClick={handleUserLogout}>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </div>
      </div>
      <div className="overflow-hidden">
        <Livetracking />
      </div>
      <div
        onClick={() => {
          if (crpanel && !vechilef && !waitingfordriver) {
            setcrpanel(false);
            setvechilepanel(true);
          } else if (vechilepanel && !vechilef && !waitingfordriver) {
            setpanel(true);
            setvechilepanel(false);
          }
        }}
        className=" absolute h-screen w-full top-0 flex flex-col justify-end pointer-events-none z-50"
      >
        <div ref={findTripRef} className="h-[30%] bg-white p-5 relative pointer-events-auto">
          <h5
            ref={closepanel}
            onClick={() => {
              setpanel(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <div className="flex justify-center">
            <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 border-b-2 border-b-indigo-600">
              Find a Trip
            </h4>
          </div>
          <form
            onSubmit={(e) => {
              submithandler(e);
            }}
          >

            <input
              onClick={() => {
                setpanel(true);
                setactivefield("pickup");
              }}
              value={pickup}
              onChange={handlepickupchange}
              className="bg-[#eee] px-8 py-2 text-base rounded-lg w-full mt-3 font-semibold"
              type="text"
              placeholder="Add a Pick-up location"
            />
            <input
              onClick={() => {
                setpanel(true);
                setactivefield("destination");
              }}
              value={destination}
              onChange={handledestinationchange}
              className="bg-[#eee] px-8 py-2 text-base rounded-lg w-full mt-3 font-semibold"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>
        <div ref={panelref} className="h-[0%] bg-white pointer-events-auto">
          {" "}
          <Locationsearchpanel
            setoverf={setoverf}
            setvechilepanel={setvechilepanel}
            setpanel={setpanel}
            suggestions={
              activefield === "pickup"
                ? pickupsuggestions
                : destinationsuggestions
            }
            setpickup={setpickup}
            setdestination={setdestination}
            activefield={activefield}
            findtrip={findtrip}
            setsuccess={setsuccess}
          />
        </div>
      </div>
      <div
        ref={vechilepanelref}
        className=" translate-y-full fixed w-full bg-white z-10 bottom-0 px-3 py-6"
      >
        <Vechilepanel
          setvechiletype={setvechiletype}
          vechilepanel={vechilepanel}
          setvechilepanel={setvechilepanel}
          setcrpanel={setcrpanel}
          setpanel={setpanel}
          fare={fare}
          success={success}
          setsuccess={setsuccess}
          setamt={setamt}
        ></Vechilepanel>
      </div>
      <div
        ref={crref}
        className=" translate-y-full fixed w-full bg-white z-50 bottom-0 px-3 py-6"
      >
        <Confirmridpanel
          pickup={pickup}
          amt={amt}
          vechiletype={vechiletype}
          destination={destination}
          createride={createride}
          setcrpanel={setcrpanel}
          setvechilef={setvechilef}
        />
      </div>
      <div
        ref={vechilefref}
        className=" translate-y-full fixed w-full bg-white z-50 bottom-0 px-3 py-6"
      >
        <Lookingfordriver
          vechiletype={vechiletype}
          pickup={pickup}
          amt={amt}
          destination={destination}
          setvechilef={setvechilef}
          setcrpanel={setcrpanel}
        ></Lookingfordriver>
      </div>
      <div
        ref={Waitingfordriverref}
        className=" translate-y-full fixed w-full bg-white z-50 bottom-0 px-3 py-6"
      >
        <Waitingfordriver
          ridedata={ridedata}
          setwaitingfordriver={setwaitingfordriver}
        ></Waitingfordriver>
      </div>
    </div>
  );
};

export default Home;
