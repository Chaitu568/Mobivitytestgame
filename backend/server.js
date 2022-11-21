const port = process.env.PORT || 8080;

const io = require("socket.io")(port, {
  cors: ["http://localhost:3000", "https://drasmash-a34fc.firebaseapp.com/"],
});

let groupUsers = {};
const rooms = [{ id: "1122333", name: "china" }];
const gameRooms = [{ id: "1122333", isPlaying: false, lastPlayed: {} }];
const offGame = (groupId) => {
  const i = gameRooms.findIndex((ele) => ele.id == groupId);
  gameRooms[i].isPlaying = false;
  gameRooms[i].lastPlayed = {};
};

io.on("connection", (socket) => {
  socket.on("added-room", (room) => {
    rooms.push(room);
    gameRooms.push({ id: room.id, isPlaying: false, lastPlayed: "" });
    socket.broadcast.emit("added-room", rooms);
  });
  socket.on("getRoom", (a) => {
    socket.emit("sendRoom", rooms);
  });
  socket.on("join", (groupId, userId, userName) => {
    socket.join(groupId);
    if (!groupUsers[groupId]) {
      groupUsers[groupId] = [
        {
          userId,
          score: 0,
          key: Math.random().toString(),
          userName,
          socketId: socket.id,
        },
      ];
    } else {
      groupUsers[groupId] = groupUsers[groupId].filter(
        ({ userId: id }) => id !== userId
      );
      groupUsers[groupId].push({
        userId,
        score: 0,
        key: Math.random().toString(),
        userName,
        socketId: socket.id,
      });
    }
    if (groupUsers[groupId].length === 2) {
      const i = gameRooms.findIndex((ele) => ele.id == groupId);
      gameRooms[i].isPlaying = true;
      gameRooms[i].lastPlayed = groupUsers[groupId][0];
      socket.to(groupId).emit("play-game", groupUsers[groupId][0]);
      socket.emit("play-game", groupUsers[groupId][0]);
    }

    socket.to(groupId).emit("joined", groupUsers[groupId]);
    socket.emit("joined", groupUsers[groupId]);
  });

  socket.on("canvas-data", (data, groupId) => {
    socket.broadcast.to(groupId).emit("canvas-data", data);
  });

  socket.on("close", (id, groupId) => {
    if (groupUsers[groupId])
      groupUsers[groupId] = groupUsers[groupId].filter(
        ({ userId }) => userId !== id
      );
    if (groupUsers[groupId].length == 1) {
      offGame(groupId);
      socket.to(groupId).emit("stop-playing");
    } else if (groupUsers[groupId].length >= 2) {
      console.log("CLOSE");
      const index = gameRooms.findIndex((ele) => ele.id === groupId);
      if (gameRooms[index].lastPlayed.userId === id) {
        console.log("EMIT PLAY_GAME");
        socket.to(groupId).emit("play-game", groupUsers[groupId][0]);
      }
    }
    socket.broadcast.to(groupId).emit("left", groupUsers[groupId]);
  });

  socket.on("logout", (id) => {
    let groupId;
    for (const i in groupUsers) {
      groupUsers[i] = groupUsers[i].filter(({ userId }) => {
        if (userId != id) {
          return true;
        }
        groupId = i;
        return false;
      });
    }
    if (groupId) {
      if (groupUsers[groupId].length == 1) {
        offGame(groupId);
        socket.to(groupId).emit("stop-playing");
      } else if (groupUsers[groupId].length >= 2) {
        console.log("LOGOUT");
        const index = gameRooms.findIndex((ele) => ele.id === groupId);
        if (gameRooms[index].lastPlayed.userId === id) {
          console.log("EMIT PLAY_GAME");
          socket.to(groupId).emit("play-game", groupUsers[groupId][0]);
        }
      }
    }
    socket.broadcast.emit("logout", groupUsers);
  });

  socket.on("disconnect", () => {
    let groupId;
    for (const i in groupUsers) {
      groupUsers[i] = groupUsers[i].filter(({ socketId }) => {
        if (socketId != socket.id) {
          groupId = i;
          return true;
        } else {
          return false;
        }
      });
    }
    if (groupId) {
      if (groupUsers[groupId].length == 1) {
        offGame(groupId);
        socket.to(groupId).emit("stop-playing");
      } else if (groupUsers[groupId].length >= 2) {
        const index = gameRooms.findIndex((ele) => ele.id === groupId);
        if (
          gameRooms[index].isPlaying &&
          gameRooms[index].lastPlayed.socketId === socket.id
        ) {
          socket.to(groupId).emit("play-game", groupUsers[groupId][0]);
        }
      }
    }
    socket.to(groupId).emit("left", groupUsers[groupId]);
  });
  socket.on("send-message", (groupId, message) => {
    socket.to(groupId).emit("recieve-message", message);
  });
  socket.on("choosed-word", (word, groupId) => {
    socket.to(groupId).emit("selected-word", word);
  });
  socket.on("next-player", (id, groupId) => {
    if (groupUsers[groupId].length >= 2) {
      const i = groupUsers[groupId].findIndex(({ userId }) => userId == id);
      const index = gameRooms.findIndex(({ id }) => id == groupId);
      if (i < groupUsers[groupId].length - 1) {
        socket.to(groupId).emit("play-game", groupUsers[groupId][i + 1]);
        socket.emit("play-game", groupUsers[groupId][i + 1]);
        gameRooms[index].lastPlayed = groupUsers[groupId][i + 1];
      } else {
        socket.to(groupId).emit("play-game", groupUsers[groupId][0]);
        socket.emit("play-game", groupUsers[groupId][0]);
        gameRooms[index].lastPlayed = groupUsers[groupId][0];
      }
    }
  });
  socket.on("increase-score", (id, groupId) => {
    const index = groupUsers[groupId].findIndex(({ userId }) => userId == id);
    groupUsers[groupId][index].score += 10;
    socket.to(groupId).emit("increase-score", groupUsers[groupId], id);
    socket.emit("increase-score", groupUsers[groupId], id);
  });
});
