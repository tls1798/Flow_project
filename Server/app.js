const app = require("express")();
const http = require("http").createServer(app);
const io = require('socket.io')(http);

const port = 3333;

http.listen(port, () => {
    console.log("listening on *:" + port);
});

const flow = io.of('/flow');

// Object.keys 메서드가 써지지 않아 Key값만 List형태로 가지고 있기 위함
let onlineMemberList = new Set();
let memberSocketId = new Map();

flow.on('connection', (socket) => {
    
    // 온라인
    socket.on('online', (memNo) => {
        socket.join('online')
        // List, Map 에 접속중인 멤버 세팅
        memberSocketId.set(memNo, socket.id)
        onlineMemberList.add(memNo)
        onlineMemberList.forEach(memNo => {
            flow.to('online').emit('online',memNo)
        })
    })
    // 초대 갱신
    socket.on('invite', (memNo) => {
        socket.join('online')
        memNo.forEach(memno => {
            flow.to('online').emit(memno)    
        })
    })

    socket.on('disconnect', () => {
        flow.to('online').emit('resetList')
        // 접속 종료한 멤버값 없애기
        onlineMemberList.forEach(memNo => {
            if (memberSocketId.get(memNo) == socket.id) {
                memberSocketId.delete(memNo)
                onlineMemberList.delete(memNo)
            }
            else
            flow.to('online').emit('online',memNo)
        })
    })

    // 알림
    socket.on('setting', (roomNo) => {
        socket.join(roomNo)
    })

    socket.on('room', (roomNo) => {
        socket.to(roomNo).emit(roomNo)
    })
})
