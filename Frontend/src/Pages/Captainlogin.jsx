import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import home from "../assets/home.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [captaindata, setcaptaindata] = useState({});
  const submitHandler = async(e) => {
    e.preventDefault(); //prevent default form submissions
    try {
     const captain=({
        email: email,
        password: password,
      });
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/login`,
      captain);
      if(response.status===200){
        const data=response.data
        setcaptaindata(data.captain)
        localStorage.setItem("token",data.token);
        navigate("/captain-home");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-7 bg-yellow-100 h-screen flex flex-col justify-between">
      {/* Attach the submitHandler to the form */}
      <form onSubmit={submitHandler}>
        <div className="flex justify-between ">
          <img src={home} alt="Home Icon" width={40} className="mb-10" />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA5FLPEPvhfp9A9uPYAuhQ_Ja31kUTEDdFFg&s"
            alt=""
            width={40}
            className="h-10"
          />
        </div>
        <h3 className="text-lg mb-2">What's your Email</h3>
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your Email"
          className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-full"
        />
        <h3 className="text-lg font-normal mb-2">Enter Password</h3>
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your Password"
          className="bg-[#f1f0f0e3] border-2 border-yellow-200 rounded px-2 py-3 w-full"
        />
        <button
          type="submit"
          className="bg-yellow-300 rounded-md px-2 py-3 mt-4 w-full text-lg font-normal"
        >
          Login
        </button>
        <p className="mt-4">
          Want to join our fleet?{" "}
          <Link className="text-[#090b6fee]  font-medium" to="/captain-signup">
            Create your Account
          </Link>
        </p>
      </form>
      <Link
        to={"/login"}
        type="button"
        className="bg-[#589bce] rounded-md px-2 py-3 mt-4 w-full text-lg font-normal flex items-center justify-center"
      >
        Sign in as User
      </Link>
    </div>
  );
};

export default Captainlogin;
