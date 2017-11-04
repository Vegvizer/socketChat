const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');


const {generateMessage, generateLocationMessage} = require('./utils/message');


var publicpath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicpath));


io.on('connection', (socket)=>{
    console.log("new user connected");

    socket.emit('newMsg',generateMessage('Admin','Welcome to our chat'));

    socket.broadcast.emit('newMsg',generateMessage('Admin','A new User Joined'));

    socket.on('createMsg', (message, callback)=>{
        io.emit('createMsg',generateMessage(message.from, message.text));
        callback('This is from the server');
        
    });

    socket.on('createLocationMsg', (coords)=>{
        io.emit('newLocationMsg', generateLocationMessage('Admin',coords.latitude, coords.longitude))
    })

    socket.on('disconnect', ()=>{
        console.log("client disconnected");
    });

});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
  });
  