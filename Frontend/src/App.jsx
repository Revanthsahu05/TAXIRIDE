import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Userlogin from './Pages/Userlogin'
import Usersignup from './Pages/Usersignup'
import Captainsignup from './Pages/Captainsignup'
import Captainlogin from './Pages/Captainlogin'
import { Userdatacontext } from './context/Usercontext'
import Userlogout from './Pages/Userlogout'
import Start from './Pages/Start'
import Userprotectwrapper from './Pages/Userprotectwrapper'
import Captainhome from './Pages/Captainhome'
import Captainprotectwrapper from './Pages/Captainprotectwrapper'
import Riding from './Pages/Riding'
import Captainriding from './components/Captainriding'
import RideCompletedPage from './Pages/RideCompletedPage'
import RideCancelledPage from './Pages/RideCancelledPage.JSX'
import CaptainVehicleInfo from './Pages/CaptainVehicleInfo'
import UserVerification from './Pages/UserVerification';
import CaptainVerification from './Pages/CaptainVerification';
import GoogleCallback from './Pages/GoogleCallback';
import "./App.css";
import axios from 'axios';

axios.defaults.withCredentials = true;

// Queue and lock to handle simultaneous requests when token expires
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Global Axios response interceptor for automatic silent token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only catch 401 Unauthorized errors and do not intercept the refresh-token endpoint itself
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh-token')
    ) {
      // If another request is already in the middle of refreshing the token, queue this one
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isCaptain =
        originalRequest.url?.includes('/captain') ||
        window.location.pathname.startsWith('/captain');

      const refreshUrl = isCaptain
        ? `${import.meta.env.VITE_BASE_URL}/captain/refresh-token`
        : `${import.meta.env.VITE_BASE_URL}/users/refresh-token`;

      try {
        const response = await axios.post(refreshUrl);
        const newToken = response.data?.token;

        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request seamlessly with new httpOnly cookie
        return axios(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        console.warn("Session expired (7-day refresh token expired). Redirecting to login...");

        const targetLogin = isCaptain ? '/captain-login' : '/login';
        if (window.location.pathname !== targetLogin) {
          window.location.href = targetLogin;
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

const App = () => {
  const ans = useContext(Userdatacontext)
  // console.log(ans)
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/Usersignup" element={<Usersignup />} />
        <Route path="/user-verification" element={<UserVerification />} />
        <Route path="/google-callback" element={<GoogleCallback />} />

        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<Captainsignup />} />
        <Route path="/captain-verification" element={<CaptainVerification />} />
        <Route path="/captain-vehicle-info" element={
          <Captainprotectwrapper>
            <CaptainVehicleInfo />
          </Captainprotectwrapper>
        } />
        <Route path="/riding" element={<Riding></Riding>}></Route>
        <Route
          path="/home"
          element={
            <Userprotectwrapper>
              <Home />
            </Userprotectwrapper>
          }
        />
        <Route path="/ride-completed" element={<RideCompletedPage />} />
        <Route
          path="/user/logout"
          element={
            <Userprotectwrapper>
              <Userlogout />
            </Userprotectwrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <Captainprotectwrapper>
              <Captainhome></Captainhome>
            </Captainprotectwrapper>
          }
        ></Route>
        <Route path="/cancelride" element={<RideCancelledPage />}></Route>
        <Route path="/captainriding" element={<Captainriding />}></Route>
      </Routes>
    </div>
  );
}

export default App
