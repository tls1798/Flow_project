import { getAllAlarmsAjax, ProjectList, getAllParticipantsAjax } from './ajax.js';

export let onlinelist = [];

$(function () {
    socket.emit('online', window.localStorage.getItem('memNo'))
    
    // 접속중인 멤버 리스트에 담기
    socket.on('online', (onlinememNo) => {
        onlinelist.push(onlinememNo)
        getAllParticipantsAjax(window.localStorage.getItem('rmNo'))
    })
    
    // 리스트 초기화
    socket.on('resetList', () => {
        onlinelist = [];
    })
})

// 경과시간 계산 함수
export function elapsedTime(date) {
    const start = new Date(date);
    const end = new Date(); // 현재 날짜
    const diff = (end - start); // 경과 시간

    const times = [
        { time: "분", milliSeconds: 1000 * 60 },
        { time: "시간", milliSeconds: 1000 * 60 * 60 },
    ].reverse();

    // 년 단위부터 알맞는 단위 찾기
    for (const value of times) {
        const betweenTime = Math.floor(diff / value.milliSeconds);

        // 큰 단위는 0보다 작은 소수 단위 나옴
        if (betweenTime > 0) {
            if (betweenTime >= 24 && value.time == '시간')
                return date;
            else
                return `${betweenTime}${value.time} 전`;
        }
    }

    // 모든 단위가 맞지 않을 시
    return "방금전";
}

// 소켓 하나만 사용하기 위한 Export
export const socket = io.connect('http://localhost:3000/flow');

export function setting() {
    // 멤버마다 각각의 프로젝트에 대한 방 설정과 통신을 위한 Foreach

    ProjectList.forEach(Projectroom => {
        socket.emit('setting', Projectroom);
        socket.on(Projectroom, () => {            
            // 알림레이어 업데이트
            getAllAlarmsAjax();
        })
    });
}
