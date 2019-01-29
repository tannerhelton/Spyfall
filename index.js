const path = require("path");
const PORT = process.env.PORT || 5000;

var express = require("express");
var app = express();
var http = require("http").Server(app);

app.use(express.static(path.join(__dirname, "client")));

var server = http.listen(PORT, function() {
  console.log("Server listening on tannerhelton.com:" + PORT);
});

var games = {};

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
  socket.on("newGame", function() {
    var gameCode = makeid(4);
    games[gameCode] = {
      code: gameCode,
      users: []
    };
    console.log("New game created with code: " + gameCode);
    socket.emit("newGameCreated", gameCode);
  });

  socket.on("name", function(gameId, nameProp) {
    if (games[gameId] != null) {
      games[gameId].users.push(nameProp);
      console.log("New User: " + nameProp + " added to game: " + gameId);
      socket.emit("newUserConnected", gameId, games[gameId].users);
      socket.broadcast.emit("newUserConnected", gameId, games[gameId].users);
    }
  });

  socket.on("disconnect", function() {
    if (!socket.user) {
      return;
    }
    if (users.indexOf(socket.user) > -1) {
      console.log(socket.user + " disconnected");
      users.splice(users.indexOf(socket.user), 1);
      socket.broadcast.emit("otherUserDisconnect", socket.user);
    }
  });

  // socket.on("message", function(data) {
  //   io.sockets.emit("message", {
  //     user: socket.user,
  //     message: data
  //   });
  // });
});

function makeid(strLength) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < strLength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
