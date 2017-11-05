const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');



const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var publicpath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicpath));


io.on('connection', (socket)=>{
    console.log("new user connected");



    socket.on('join', (urlParams, callback)=>{
        if(!isRealString(urlParams.name) || !isRealString(urlParams.room)){
            return callback('Name and Room name are required.');
        }

        socket.join(urlParams.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,urlParams.name, urlParams.room);

        io.to(urlParams.room).emit('updateUserList', users.getUserList(urlParams.room));
        socket.emit('newMsg',generateMessage('Admin','Welcome to our chat'));
        socket.broadcast.to(urlParams.room).emit('newMsg',generateMessage('Admin',`${urlParams.name} has joined the room.`));
        callback();
    });

    
    socket.on('createMsg', (message, callback)=>{
        io.emit('createMsg',generateMessage(message.from, message.text));
        callback('This is from the server');
        
    });

    socket.on('createLocationMsg', (coords)=>{
        io.emit('newLocationMsg', generateLocationMessage('Admin',coords.latitude, coords.longitude))
    })

    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMsg', generateMessage('Admin', `${user.name} has left the room.`))
        }
    });

});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
  });
  