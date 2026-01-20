import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Userdatacontext } from '../context/Usercontext';
import { captaindatacontext } from '../context/Captaincontext';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useContext(Userdatacontext);
    const { setCaptain } = useContext(captaindatacontext);

    useEffect(() => {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (token) {
            // Token is set in cookie by backend, we just handle navigation

            if (type === 'user') {
                navigate('/home');
            } else if (type === 'captain') {
                navigate('/captain-home');
            } else {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            Processing Login...
        </div>
    );
};

export default GoogleCallback;
