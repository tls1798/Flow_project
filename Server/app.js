const { formatWithOptions } = require("util");

var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http, { cors: { origin: "*" } });

var port = 3000;
http.listen(port, () => {
    console.log("listening on *:" + port);
});
var flow = io.of('/flow');
flow.on('connection', (socket) => {

    socket.on('setting', (roomNo) => {
        socket.join(roomNo)
    })
 
    socket.on('room', (roomNo) => {
        socket.to(roomNo).emit(roomNo,'hi')
    })
})