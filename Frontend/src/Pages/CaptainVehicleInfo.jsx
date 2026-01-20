import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { captaindatacontext } from "../context/Captaincontext";
import axios from "axios";

const CaptainVehicleInfo = () => {
    const navigate = useNavigate();
    const { captain, setCaptain } = useContext(captaindatacontext);

    const [vechilecolor, setvechilecolor] = useState("");
    const [vechileplate, setvechileplate] = useState("");
    const [vechilecapacity, setvechilecapacity] = useState("");
    const [vechiletype, setvechiletype] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const vehicleData = {
                color: vechilecolor,
                Plate: vechileplate,
                capacity: vechilecapacity,
                vechiletype: vechiletype,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/captain/vehicle-info`,
                vehicleData
            );

            if (response.status === 200) {
                setCaptain(response.data.captain);
                navigate('/captain-home');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-4 bg-yellow-100 h-screen flex flex-col justify-between">
            <form onSubmit={submitHandler}>
                <h3 className="text-lg mb-2">Vehicle Information</h3>
                <div className="flex gap-2">
                    <input
                        required
                        type="text"
                        placeholder="Enter Vehicle Color"
                        value={vechilecolor}
                        onChange={(e) => setvechilecolor(e.target.value)}
                        className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-1/2"
                    />

                    <input
                        required
                        type="text"
                        placeholder="Enter Vehicle Plate"
                        value={vechileplate}
                        onChange={(e) => setvechileplate(e.target.value)}
                        className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-1/2"
                    />
                </div>
                <div className="flex gap-2 mt-4">
                    <input
                        required
                        type="number"
                        placeholder="Enter Vehicle Capacity"
                        value={vechilecapacity}
                        onChange={(e) => setvechilecapacity(e.target.value)}
                        className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-full"
                    />
                    <select
                        required
                        value={vechiletype}
                        onChange={(e) => setvechiletype(e.target.value)}
                        className="bg-[#f1f0f0e3] font-normal border-2 border-yellow-200 rounded px-2 py-3 w-full"
                    >
                        <option value="" disabled>
                            Select Vehicle Type
                        </option>
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-yellow-300 rounded-md px-2 py-3 mt-4 w-full text-lg font-normal"
                >
                    Confirm Vehicle Details
                </button>
            </form>
        </div>
    );
};

export default CaptainVehicleInfo;
