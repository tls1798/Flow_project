var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http, { cors: { origin: "*" } });

var port = 3000;
http.listen(port, () => {
    console.log("listening on *:" + port);
});

io.on('connection', function (socket) {
    socket.on('updateAlarmsEventToServer', function () {
        socket.broadcast.emit('updateAlarmsEventToClient');
    })
})