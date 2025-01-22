import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import home from '../assets/home.png'
const Usersignup = () => {
  const submithandler=(e)=>{
    e.preventDefault()
    setuserdata({
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email:email,
      password:password
    });
    console.log(userdata);
    setemail('');
    setpassword('');
    setfirstname('');
    setlastname('');
  }
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
   const [userdata, setuserdata] = useState({})
  return (
    <div className="p-7 bg-yellow-100 h-screen flex flex-col justify-between">
      {/* Attach the submitHandler to the form */}
      <form
        onSubmit={(e) => {
          submithandler(e)
        }}
      >
        <div className="flex justify-between ">
          <img src={home} alt="Home Icon" width={40} className="mb-10" />
          <img
            src="data:image/png;base64,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"
            alt=""
            width={40}
            className="h-10"
          />
        </div>
        <h3 className="text-lg mb-2">What's your Name</h3>
        <div className="flex gap-4">
          <input
            required
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => {
              setfirstname(e.target.value);
            }}
            className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-1/2"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => {
              setlastname(e.target.value);
            }}
            className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-1/2"
          />
        </div>
        <h3 className="text-lg mb-2">What's your Email</h3>
        <input
          required
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-full"
        />
        <h3 className="text-lg font-normal mb-2">Enter Password</h3>
        <input
          required
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          className="bg-[#f1f0f0e3] border-2 border-yellow-200 rounded px-2 py-3 w-full"
        />
        <button
          type="submit"
          className="bg-yellow-300 rounded-md px-2 py-3 mt-4 w-full text-lg font-normal"
        >
          Login
        </button>
        <p className="mt-4">
          Already have an Account?{" "}
          <Link className="text-[#090b6fee] font-medium" to="/login">
            Login Here
          </Link>
        </p>
      </form>
      <div className="bg-[#d7e7a7] px-2 py-3 mt-4 w-full font-normal flex text-[10px] flex-col justify-center">
        By signing up, you agree to our Terms of Service and Privacy Policy. ©
        Taxi Ride 2024.
        <div>All rights reserved.</div>
      </div>
    </div>
  );
}

export default Usersignup
