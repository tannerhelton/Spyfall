const path = require("path");
const PORT = process.env.PORT || 5000;

var express = require("express");
var app = express();
var http = require("http").Server(app);

app.use(express.static(path.join(__dirname, "client")));

var server = http.listen(PORT, function() {
  console.log("Server listening on tannerhelton.com:" + PORT);
});

var games = [];

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
  socket.on("newGame", function() {
    var randomCode = Math.floor(Math.random() * 8999) + 1000;
    for (var i = 0; i < games.length; i++) {
      if (games[i].code == randomCode) {
        randomCode = Math.floor(Math.random() * 8999) + 1000;
      }
    }

    games.push({
      code: randomCode
    });
    console.log("New game created with code: " + randomCode);
    socket.emit("newGameCreated", randomCode);
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
