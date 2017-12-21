var express = require('express');
var serveStatic = require('serve-static')
var path = require('path')
var server = express();

server.use(serveStatic(path.join(__dirname)));


var port = process.env.PORT || 8081
server.listen(port);
console.log("Use port " + port + " to connect to this server");

exports = module.exports = server;
