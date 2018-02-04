var serveStatic = require('serve-static');
var path = require('path');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var port = process.env.PORT || 8081;

// var server = app.listen(port, () => console.log("Use port " + port + " to connect to this server"));
// var io = require('socket.io')(server);

var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(serveStatic(path.join(__dirname)));
app.use(express.static(__dirname + '/media/profile_images'));

app.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './media/profile_images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({
  storage: storage
}).single('file');

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    console.log("Filed Name: ", req.file)
    res.status(204).end();
  })
});

app.get('*', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

var users = [];
var numUsers = 0;
//var room_no = 1;
io.on('connection', function (socket) {
  var connected = false;
  var user = {};

  socket.on('connect-user', function (data) {

    if (!connected) {
      connected = true;
      display_name = data.display_name;
      ++numUsers;
      user = {
        display_name: data.display_name,
        socket_id: socket.id
      };
      users.push(user);

      socket.emit('connect-user', socket.id);

      console.log("Connected User Id: ", data.user_id, "\nUsers: ", users, "\nUser: ", user, "\nConnected: ", connected, "\nNumber of Users: ", numUsers);
    }
  });

  // socket.on('connect', function (data) {
  //   console.log(socket.id + ' has connected to the chat.', data);
  //   console.log("Users: ", users);
  // });

  socket.on('changeRoom', function (room_no) {
    io.sockets.in('room-' + room_no)
      .emit('changeRoom', "You are in Room No " + room_no);
  })

  socket.on('broad', function (message) {
    console.log('broad event', message);
    //io.emit(message);
  });

  socket.on('messages', function (data) {
    console.log("Messages Event", data);
    io.in('room-' + data.room_id).emit('broad', data.message);
  });

  socket.on('join', function (channel) {
    console.log("join channel", channel)
    socket.join('room-' + channel);
  });

  socket.on('private-room', function (data) {
    console.log("Private Room Broadcast", data.room_id, data.message, "\n", users, "\n", user, "\nDisplayName ", data.invitee);
    console.log("Index of display name", users.findIndex(i => i.display_name === data.invitee));
    var inviteeIndex = users.findIndex(i => i.display_name === data.invitee);
    var user = users[inviteeIndex];
    socket_id = user.socket_id;

    socket.broadcast.to(socket_id).emit('notify-private', { room_id: data.room_id, message: data.message });
  })

  socket.on('disconnect', function (data) {
    if (connected) {
      --numUsers;
      //users.splice(data.user_id);
      console.log(socket.id + ' has disconnected from the chat.\nNumber remaining', numUsers);
      connected = false;
    }
  });
});

server.listen(port);

exports = module.exports = server;
