import {autoaccess} from './autoAccess.js'
import projectList from './projectList.js';

$(function () {
    var socket = io.connect('http://192.168.240.127:3000');
    socket.on('data', () => {
        clearAndUpdateAlarms();
    })
})

const updateAlarmsFunction = function () {
    let accessToken = window.localStorage.getItem('accessToken')
    let memNo = window.localStorage.getItem('memNo')

    new Promise((succ,fail)=>{
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/notis/member/' + memNo,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", accessToken);
            },
            success: function (result, status, xhr) {
                succ(result);
    
                // 미확인 알림 count
                var cnt = 0;
    
                // 읽음 여부 확인해서 미확인/전체 나누기 (미확인이면 addClass('on'))
                for(var i=0; i<result.length; i++){
    
                    // 읽음 여부
                    var checked;
                    if(result[i].ntTemp[memNo]==null){
                        checked = `<li class="js-alarm-item on" data-project-no=`+result[i].rmNo+` data-notis-no=`+result[i].ntNo
                            +` data-type-no=`+result[i].ntTypeNo+ ` data-detail-no=`+result[i].ntDetailNo+` data-post-no=`+result[i].postNo+`>`;
                        ++cnt;
                    }
                    else
                        checked = `<li class="js-alarm-item" data-project-no=`+result[i].rmNo+` data-notis-no=`+result[i].ntNo
                            +` data-type-no=`+result[i].ntTypeNo+ ` data-detail-no=`+result[i].ntDetailNo+` data-post-no=`+result[i].postNo+`>`;
                    
                    // 알림 종류에 따른 문구
                    var des;
                    var content = `<div class="all-text-wrap-type-3 alarm-cont">`+result[i].notiContent+`</div>`;
                    if(result[i].ntTypeNo==1)
                        des = `님의 글 등록`;
                    else if(result[i].ntTypeNo==2)
                        des = `님의 댓글 등록`;
                    else{
                        des = `님이 초대합니다`;
                        content = ``;
                    }
    
                    $('#alarmUl').append(
                        checked+`   
                            <div class="all-setup-picture-type-1"
                                style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)"></div>
                            <div class="all-text-wrap-type-1">
                                <div class="all-setup-section-type-1">
                                    <span>`+result[i].rmTitle+`</span><em class="alarm-datetime">`+elapsedTime(result[i].ntDatetime)+`</em>
                                </div>
                                <div class="all-text-wrap-type-2 alarm-tit-ellipsis">`+result[i].memName+des+`</div>
                                `+content+`
                            </div>
                        </li>
                    `);
                }
    
                // 알림 count
                if(result.length>0 && result[0].ntCount!=0){
                    $('#leftProjectHomeCount').css('display', 'inline-block');
                    $('#alarmTopCount').css('display', 'block');
                    $('#leftProjectHomeCount').text(result[0].ntCount);
                    $('#alarmTopCount').text(result[0].ntCount);
                }else{
                    $('#leftProjectHomeCount').css('display', 'none');
                    $('#alarmTopCount').css('display', 'none');
                }
    
                // 알림 레이어에 모두 추가하고, 현재 on 상태인 탭 click
                if ($('.js-read').hasClass('on'))
                    $('.js-read').click();
                else
                    $('.js-unread').click();
            },
            error: function (xhr, status, err) {
                autoaccess()
            }
        });
    }).then((arg)=>{
        // change 이벤트 일으켜서 피드 미확인도 갱신하도록 함
        $('#alarmTopCount').change();
    })
}

// 경과시간 계산 함수
const elapsedTime = function (date) {
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

// 알림레이어 초기화 및 업데이트 함수
const clearAndUpdateAlarms = function() {
    // 초기화
    $('#alarmUl').find('li').remove();
    // 알림레이어 업데이트
    updateAlarmsFunction();
}

export default function updateAlarms() {
    return clearAndUpdateAlarms();
}