$(document).ready(function() {
  var socket = io.connect();

  // Initial game selection (join vs new)
  $("#newGameBtn").click(function() {
    socket.emit("newGame");
    $("#gameSelection").hide(1000);
    $("#newGameMode").show(1000);
  });

  $("#joinGameBtn").click(function() {
    $("#gameSelection").hide(1000);
  });

  socket.on("newGameCreated", function(props) {
    $("#newGameCode").append("<div><strong>" + props + "</strong></div>");
  });

  $("#user-save").click(function() {
    var username = $("#gameCodeText");
    var txt = username.val().trim();
    console.log(txt);
    if (txt.length > 0) {
      name = txt;
      username.prop("disabled", true);
      $("#group").prop("disabled", true);
      $(this).hide();
      $("#controls").show();
      $("#message").prop("disabled", false);
      $("#send").prop("disabled", false);
      socket.emit("user", name);
      $("#usernames").append("<div><strong>" + name + "</strong></div>");
    }
  });

  socket.on("otherUserConnect", function(data) {
    $("#usernames").append("<div><strong>" + data + "</strong></div>");
  });

  socket.on("otherUserDisconnect", function(data) {
    $("#log").append("<div><strong>" + data + " disconnected</strong></div>");
  });

  $("#send").click(function() {
    var input = $("#message");
    var text = input.val().trim();
    if (text.length > 0) {
      socket.emit("message", text);
    }
    input.val("");
  });

  $("#message").keypress(function(event) {
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
