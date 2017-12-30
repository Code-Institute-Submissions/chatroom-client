var serveStatic = require('serve-static');
var path = require('path');

var express = require('express');
var app = express();

var port = process.env.PORT || 8081;

// var server = app.listen(port, () => console.log("Use port " + port + " to connect to this server"));
// var io = require('socket.io')(server);

var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(serveStatic(path.join(__dirname)));

app.get('*', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

//var room_no = 1;
io.on('connection', function (socket) {

  socket.on('connect', function (data) {
    console.log(socket.name + ' has connected to the chat.' + socket.id);
  });

  socket.on('changeRoom', function(room_no){
    io.sockets.in('room-' + room_no)
    .emit('changeRoom', "You are in Room No " + room_no);
  })

  socket.on('broad', function (message) {
    console.log('broad event', message);
    //io.emit(message);
  });

  socket.on('messages', function (data) {
    console.log("Messages Event", data);
    io.in('room-'+data.room_id).emit('broad', data.message);
  });

  socket.on('join', function (channel) {
    console.log("join channel", channel)
    socket.join('room-' + channel);

  });

  socket.on('disconnect', function () {
    console.log(socket.id + ' has disconnected from the chat.');
  });
});

server.listen(port);

exports = module.exports = server;
