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

io.on('connection', function (client) {
    console.log(client.name + ' has connected to the chat.' + client.id);

    client.on('join', function (data) {
        console.log(data);
    });

    client.on('messages', function (data) {
        client.emit('broad', data);
    });

    client.on('disconnect', function () {
        console.log(client.name + ' has disconnected from the chat.' + client.id);
    });
});

server.listen(port);

exports = module.exports = server;
