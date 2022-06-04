const express = require('express');
const NodeMediaServer = require('node-media-server');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
const port = 3000


const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)
nms.run();


connections = [];
io.sockets.on('connection', function(socket) {
	console.log("Good conection");

	connections.push(socket);

  socket.on('room', room => {
    if(socket.room){
      socket.leave(socket.room)
    }
    socket.room = room;
    socket.join(room);
  });
	
	socket.on('disconnect', function(data) {
	
		connections.splice(connections.indexOf(socket), 1);
		console.log("Disconnect");
	});

	
	socket.on('send mess', function(data) {
    io.sockets.to(socket.room).emit('add mess', {mess: data.mess, name: data.name});
    if(data.mess == "/room"){
      io.sockets.to(socket.room).emit('add mess', {mess: "You room is : " + socket.room, name: "Bot"});
    }
	});

});
app.get('/', (req, res) => {
    res.send('PalyanyciaTV : Hello World')
  })
server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });