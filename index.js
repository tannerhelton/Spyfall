function Game(argId) {
  this.players = [];
  this.id = argId;
}

Game.prototype.getId = function () {
  return this.id;
}

Game.prototype.getPlayers = function () {
  return this.players;
}

Game.prototype.addPlayer = function (name) {
  this.players.push(name);
}

Game.prototype.removePlayer = function (name) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].equals(name)) {
      this.players.splice(i, 1);
    }
  }
}

const path = require("path");
const PORT = process.env.PORT || 5000;

var express = require("express");
var app = express();
var http = require("http").Server(app);

app.use(express.static(path.join(__dirname, "client")));

var server = http.listen(PORT, function () {
  console.log("Server listening on tannerhelton.com:" + PORT);
});

var games = {};

var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
  socket.on("newGame", function () {
    var gameCode = makeid(4);
    games[gameCode] = new Game(gameCode);
    console.log("New game created with code: " + gameCode);
    socket.emit("newGameCreated", gameCode);
  });

  socket.on("joinGame", function (gameId, name) {
    if (games[gameId] == null) {
      socket.emit("errorMsg", "No games have that id");
    } else {
      games[gameId].addPlayer(name);
      socket.broadcast.emit('joinGameGetPlayers', gameId, games[gameId].getPlayers());
      socket.emit('joinGameGetPlayers', gameId, games[gameId].getPlayers());
      console.log('Player: ' + name + " has joined game: " + gameId);
    }
  });

  socket.on("disconnect", function () {
    if (!socket.user) {
      return;
    }
    if (users.indexOf(socket.user) > -1) {
      console.log(socket.user + " disconnected");
      users.splice(users.indexOf(socket.user), 1);
      socket.broadcast.emit("otherUserDisconnect", socket.user);
    }
  });
});

function makeid(strLength) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < strLength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}