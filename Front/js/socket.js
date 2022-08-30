import { getAllAlarmsAjax, ProjectList, getAllParticipantsAjax ,getAllProjectsByMeAjax} from './ajax.js';
import { memNo } from './ajax.js'
export let onlinelist = [];

$(function () {
    // app.js line:20
    socket.emit('online', memNo)

    // 초대받을시 프로젝트 리스트 알림 갱신
    socket.on(memNo, () => {
        $('#projectBoardUl').find('li').remove();
        getAllProjectsByMeAjax()
        getAllParticipantsAjax(window.localStorage.getItem('rmNo'))
    })

    // 누군가 접속했을 때 발생하는 이벤트
    // 접속중인 멤버 리스트에 담기
    socket.on('online', (onlinememNo) => {
        onlinelist.push(onlinememNo)

        // 프로젝트가 있을경우에만 참여자 목록 갱신
        if (window.localStorage.getItem('rmNo') != null) {
            getAllParticipantsAjax(window.localStorage.getItem('rmNo'))
        }
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
export const socket= io.connect('http://192.168.240.127:3333/flow');

// 프로젝트 리스트 업데이트 시 실행되는 함수
// 프로젝트 리스트를 돌면서 socket.emit('setting')
export function setting() {
    // 멤버마다 각각의 프로젝트에 대한 방 설정과 통신을 위한 Foreach

    ProjectList.forEach(Projectroom => {
        // app.js line:62
        socket.emit('setting', Projectroom);

        // 프로젝트가 늘어날 때 마다 on 하기 위해 forEach 안에
        socket.on(Projectroom, (Action) => {  
            // 알림레이어 업데이트
            getAllAlarmsAjax();
            // 새 글 업데이트 버튼 활성화
            if((Action=='addComment' || Action=='addPost') 
                && Projectroom == window.localStorage.getItem('rmNo')
                && $('#detailTop').css('display')=='block'
                && $('#searchResult').hasClass('d-none'))
                    $('.post-update-button-area').removeClass('d-none');

            // 누군가 프로젝트를 나갔을 때, 참여자 업데이트
            if(Action=='updateParticipant')
                getAllParticipantsAjax(Projectroom);
        })
    });
}
