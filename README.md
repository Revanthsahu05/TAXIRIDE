# 🚖 TAXIRIDE – Real-Time Ride Sharing Web Application

TAXIRIDE is a real-time ride-sharing platform that connects passengers with drivers efficiently. Designed using the MERN stack and Socket.io, it allows users to request rides, track drivers live, and communicate instantly — all within a clean, responsive UI.

---

- Homepage
- Live driver tracking
- Booking interface
- Driver dashboard

---

## 🚀 Features

- 🔐 **User Authentication** (Sign up/Login)
- 🎭 Role switching: **Passenger** or **Driver**
- 📍 Real-time location tracking using **Socket.io + Geolocation**
- 🧭 Interactive **Mapbox** / Google Maps
- 🚘 Ride request and live updates
- ⏱ Ride lifecycle: request → accept → ongoing → complete

---

## 🛠 Tech Stack

| Layer        | Technologies                            |
|--------------|-----------------------------------------|
| **Frontend** | React.js, Tailwind CSS, Axios, Mapbox   |
| **Backend**  | Node.js, Express.js, MongoDB, Socket.io |
| **Auth**     | JWT, bcrypt                             |

---

## 📂 Folder Structure

```bash
TAXIRIDE/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── .env               # VITE_API_URL, VITE_MAPBOX_TOKEN
├── server/                # Express Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md
