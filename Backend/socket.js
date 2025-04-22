const socketio = require("socket.io");
const usermodel = require("./models/user-model");
const captainmodel = require("./models/captain-model");
let io;
function initializeSocket(server) {
  io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`client connected :${socket.id}`);
    socket.on("join", async (data) => {
      const { userid, usertype } = data;
      console.log(`user joined with id ${userid} and type ${usertype}`);
      if (usertype === "user") {
        await usermodel.findByIdAndUpdate(userid, {
          socketId: socket.id,
        });
      } else if (usertype === "captain") {
        await captainmodel.findByIdAndUpdate(userid, {
          socketId: socket.id,
        });
      }
    });
    socket.on("update-location-captain", async (data) => {
      const { captainid, location } = data;
      if(!captainid || !location.ltd || !location.lng){
        return socket.emit("error","invalid data for location update")
      }
      await captainmodel.findByIdAndUpdate(captainid, {
        location:{
            ltd:location.ltd,
            lng:location.lng
        }
      });
    });
    socket.on("disconnect", () => {
      console.log(`client disconnected :${socket.id}`);
    });
  });
}
function sendmessagetosocketid(socketid, messageobject) {
  if (io) {
    io.to(socketid).emit(messageobject.event , messageobject.data);
  } else {
    console.log("socket not initialised");
  }
}
module.exports = { initializeSocket, sendmessagetosocketid };
