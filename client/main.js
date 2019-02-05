$(document).ready(function () {
  var socket = io.connect();
  var gameId = "";
  var players = [];

  // Initial game selection (join vs new)
  $("#newGameBtn").click(function () {
    socket.emit("newGame");
    $("#gameSelection").hide(1000);
    $("#newGameMode").show(1000);
  });

  socket.on('joinGameGetPlayers', function (gameIdArg, playersArg) {
    if (gameIdArg == gameId) {
      console.log(playersArg);
      console.log(players);
      players = playersArg;
      $('.usersTable p').innerHTML = '';
      for(var i = 0; i < players.length; i++) {
        $('.usersTable').append('<p>' + players[i] + '</p>');
      }
    }
  });

  $("#joinGameBtn").click(function () {
    $("#gameSelection").hide(1000);
    $("#joinGameMode").show(1000);
  });

  $("#saveGameId").click(function () {
    var joinGameId = $("#joinGameId")
      .val()
      .trim();
    var username = $("#joinUserName")
      .val()
      .trim();
    if (username.length > 0) {
      if (joinGameId.length == 4) {
        socket.emit("joinGame", joinGameId, username);
        $(".joinGameInputContainer").prop("disabled", true);
        gameId = joinGameId;
      } else {
        alert("Please enter a valid game ID (4 characters)");
      }
    } else {
      alert('Please enter a name first');
    }
  });

  socket.on("errorMsg", function (props) {
    alert(props);
  });

  socket.on("newGameCreated", function (props) {
    gameId = props;
    $("#newGameCode").append("<div><strong>" + props + "</strong></div>");
  });

  socket.on("newUserConnected", function (gameIdCode, userArray) {
    if (gameId == gameIdCode) {
      users = userArray;
      console.log(users);
      $("#usersTable").innerHTML = "<h4>Users: </h4>";
      for (var i = 0; i < users.length; i++) {
        $("#usersTable").append("<p>" + users[i] + "</p>");
      }
    }
  });

  socket.on("otherUserConnect", function (data) {
    $("#usernames").append("<div><strong>" + data + "</strong></div>");
  });

  socket.on("otherUserDisconnect", function (data) {
    $("#log").append("<div><strong>" + data + " disconnected</strong></div>");
  });

  $("#send").click(function () {
    var input = $("#message");
    var text = input.val().trim();
    if (text.length > 0) {
      socket.emit("message", text);
    }
    input.val("");
  });

  $("#message").keypress(function (event) {
    if (event.keyCode == 13 || event.which == 13) {
      var input = $("#message");
      var text = input.val().trim();
      if (text.length > 0) {
        socket.emit("message", text);
      }
      input.val("");
    }
  });
});