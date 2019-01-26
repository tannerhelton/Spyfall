const path = require("path");
const PORT = process.env.PORT || 5000;

var express = require("express");
var app = express();
var http = require("http").Server(app);

app.use(express.static(path.join(__dirname, "client")));
//app.use(express.static(path.join(__dirname, "public")));
//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "ejs");
//app.get("/", (req, res) => res.render("pages/index"));

var server = http.listen(PORT, function() {
  console.log("Server listening on tannerhelton.com:" + PORT);
});

var users = [];

var io = require("socket.io").listen(server);
var nsp = io.of("/room1");
nsp.on("connection", function(socket) {
  console.log("someone connected");
});
nsp.emit("hi", "everyone!");

io.sockets.on("connection", function(socket) {
  socket.emit("welcome", {
    text: "You have been connected!"
  });

  socket.on("user", function(name) {
    console.log(name + " connected");
    users.push(name);
    socket.user = name;
    console.log("Current users : " + users.length);
    socket.broadcast.emit("otherUserConnect", name);
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

  socket.on("message", function(data) {
    io.sockets.emit("message", {
      user: socket.user,
      message: data
    });
  });
});
