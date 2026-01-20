import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Userdatacontext } from '../context/Usercontext';

const UserVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { setuser } = useContext(Userdatacontext);

    const email = location.state?.email;

    if (!email) {
        navigate("/Usersignup", { replace: true });
        return null;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/verify-otp`, {
                email,
                otp
            });

            if (response.status === 201 || response.status === 200) {
                const data = response.data;
                setuser(data.user);
                localStorage.setItem('token', data.token);
                navigate('/home');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="p-4 h-screen flex flex-col justify-center items-center bg-yellow-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Verify Email</h2>
                <p className="text-center mb-6 text-gray-600">
                    Enter the 6-digit code sent to <br />
                    <span className="font-semibold">{email}</span>
                </p>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={submitHandler}>
                    <input
                        required
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="bg-gray-100 border-2 border-gray-300 rounded px-4 py-3 w-full text-center text-xl tracking-widest mb-6 focus:border-yellow-400 focus:outline-none"
                        maxLength={6}
                    />

                    <button
                        type="submit"
                        className="bg-yellow-400 font-semibold rounded-md px-4 py-3 w-full text-lg hover:bg-yellow-500 transition-colors"
                    >
                        Verify Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserVerification;
