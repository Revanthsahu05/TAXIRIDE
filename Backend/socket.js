const socketio = require("socket.io");
const redis = require("./db/redis");

let io;

function initializeSocket(server) {
  io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join in-memory room for user or captain (zero database writes)
    socket.on("join", (data) => {
      const { userid, usertype } = data || {};
      if (!userid || !usertype) {
        return;
      }

      const idStr = userid.toString();
      const roomName = `${usertype}:${idStr}`;

      // Join both the namespaced room (user:<id> or captain:<id>) and raw id
      socket.join(roomName);
      socket.join(idStr);

      socket.userId = idStr;
      socket.userType = usertype;

      console.log(`[Socket] ${usertype} ${idStr} joined rooms: [${roomName}, ${idStr}] (socket: ${socket.id})`);
    });

    socket.on("update-location-captain", async (data) => {
      const { captainid, location } = data || {};
      if (!captainid || !location?.ltd || !location?.lng) {
        return socket.emit("error", "invalid data for location update");
      }
      try {
        const idStr = captainid.toString();

        // 1. In-memory Geospatial index update in Redis (zero MongoDB disk writes)
        await redis.geoadd("captains:locations", {
          longitude: Number(location.lng),
          latitude: Number(location.ltd),
          member: idStr,
        });

        // 2. Refresh driver presence heartbeat (30-second TTL)
        await redis.set(`captain:${idStr}:online`, "true", { ex: 30 });
      } catch (err) {
        console.error("[Socket] Error updating captain location in Redis:", err.message);
      }
    });

    socket.on("disconnect", async (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} (${socket.userType || 'guest'} ${socket.userId || ''}, reason: ${reason})`);
      if (socket.userType === "captain" && socket.userId) {
        try {
          await redis.del(`captain:${socket.userId}:online`);
          await redis.zrem("captains:locations", socket.userId);
        } catch (err) {
          // Non-blocking cleanup
        }
      }
    });
  });
}

/**
 * Send message to a target room (userId, captainId, or raw socket.id).
 * Socket.io handles rooms entirely in-memory with zero DB lookups.
 */
function sendmessagetosocketid(target, messageobject) {
  if (io && target) {
    const targetStr = target.toString();
    io.to(targetStr)
      .to(`user:${targetStr}`)
      .to(`captain:${targetStr}`)
      .emit(messageobject.event, messageobject.data);
  } else {
    console.warn("[Socket] Cannot send message: socket not initialized or target missing", { target });
  }
}

function sendMessageToUser(userId, messageobject) {
  if (io && userId) {
    const idStr = userId.toString();
    io.to(`user:${idStr}`).to(idStr).emit(messageobject.event, messageobject.data);
  }
}

function sendMessageToCaptain(captainId, messageobject) {
  if (io && captainId) {
    const idStr = captainId.toString();
    io.to(`captain:${idStr}`).to(idStr).emit(messageobject.event, messageobject.data);
  }
}

module.exports = {
  initializeSocket,
  sendmessagetosocketid,
  sendMessageToUser,
  sendMessageToCaptain,
};

