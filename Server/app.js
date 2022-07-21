var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http, { cors: { origin: "*" } });
const { Pool } = require('pg');

pg.connect(err => {
    if (err) console.log(err);
    else
        console.log("성공")
})

var port = 3000;
http.listen(port, () => {
    console.log("listening on *:" + port);
});

io.on('connection', function (socket) {
    socket.on('test', function (data) {
        bool = data;

        if (bool)
            socket.broadcast.emit('data');
    })
})