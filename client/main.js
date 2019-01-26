$(document).ready(function() {
  var socket = io.connect();
  var name;

  $("#user-save").click(function() {
    console.log("click");
    var username = $("#user-name");
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

  socket.on("message", function(data) {
    $("#log").append(
      "<div><strong>" + data.user + ":</strong> " + data.message + "</div>"
    );
  });
});
