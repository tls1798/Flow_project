const app = require("express")();
const http = require("http").createServer(app);
// const io = require('socket.io')(http);
const io = require('socket.io')(http, { cors: { origin: "*" } });
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
        // 'online' room에 join
        socket.join('online')

        // List, Map 에 접속중인 멤버 세팅
        memberSocketId.set(memNo, socket.id)
        onlineMemberList.add(memNo)
        onlineMemberList.forEach(memNo => {
            // 특정 방에 이벤트 전송 ('online' 방에 'online' 이벤트)
            // 현재 누가 접속 중인지 공유하기 위함
            // socket.js line:17
            flow.to('online').emit('online',memNo)
        })
    })

    // 초대 갱신
    // ajax.js line:413
    socket.on('invite', (memNo) => {
        memNo.forEach(memno => {
            if(memberSocketId.has(memno)==true)
                // socket.js line:10
                flow.to('online').emit(memno)
        })
    })

    socket.on('disconnect', () => {
        // 리스트 초기화
        // socket.js line:32
        flow.to('online').emit('resetList')

        // 접속 종료한 멤버는 삭제, 이외엔 다시 리스트에 push
        onlineMemberList.forEach(memNo => {
            if (memberSocketId.get(memNo) == socket.id) {
                memberSocketId.delete(memNo)
                onlineMemberList.delete(memNo)
            }
            else
                // socket.js line:17
                flow.to('online').emit('online',memNo)
        })
    })

    // 'roomNo' room에 join
    socket.on('setting', (roomNo) => {
        socket.join(roomNo)
    })
    // 프로젝트 인원들에게만 알림 (글/댓글 작성 및 초대)
    socket.on('room', (roomNoAndAction) => {
        // socket.js line:78
        socket.to(roomNoAndAction[0]).emit(roomNoAndAction[0], roomNoAndAction[1])
    })
    // 프로젝트 나가기
    socket.on('leave', (roomNo) => {
        socket.leave(roomNo)
        socket.to('online').emit(roomNo, 'updateParticipant')
    })
})
