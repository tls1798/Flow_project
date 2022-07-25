import {autoaccess} from './autoAccess.js'
$(function () {
    var socket = io.connect('http://localhost:3000');
    socket.on('data', () => {
        clearAndUpdateAlarms();
    })
})

const updateAlarmsFunction = function () {
    let accessToken = window.localStorage.getItem('accessToken')
    let memNo = window.localStorage.getItem('memNo')

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/notis/member/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {

            // 미확인 알림 count
            var cnt = 0;

            // 읽음 여부 확인해서 미확인/전체 나누기 (미확인이면 addClass('on'))
            for(var i=0; i<result.length; i++){

                // 읽음 여부
                var checked;
                if(result[i].ntTemp[memNo]==null){
                    checked = `<li class="js-alarm-item on" data-notis-no=`+result[i].ntNo+`>`;
                    ++cnt;
                }
                else
                    checked = `<li class="js-alarm-item" style="display:none" data-notis-no=`+result[i].ntNo+`>`;
                
                // 알림 종류에 따른 문구
                var des;
                var content = `<div class="all-text-wrap-type-3">`+result[i].notiContent+`</div>`;;
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
                                <span>`+result[i].rmTitle+`</span><em>`+result[i].ntDatetime+`</em>
                            </div>
                            <div class="all-text-wrap-type-2 alarm-tit-ellipsis">`+result[i].memName+des+`</div>
                            `+content+`
                        </div>
                    </li>
                `);
            }

            // 알림 count
            if(result.length!=0){
                $('#leftProjectHomeCount').css('display', 'inline-block');
                $('#alarmTopCount').css('display', 'block');
                $('#leftProjectHomeCount').text(result[0].ntCount);
                $('#alarmTopCount').text(result[0].ntCount);
            }else{
                $('#leftProjectHomeCount').css('display', 'none');
                $('#alarmTopCount').css('display', 'none');
            }
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 알림레이어 초기화 및 업데이트 함수
const clearAndUpdateAlarms = function() {
    // 초기화
    $('#alarmUl').find('li').remove();
    // 알림레이어 업데이트
    updateAlarmsFunction();
    // 알림 레이어 전체 탭 클릭 상태일 시
    if ($('.js-read').hasClass('on')) {
        $('.js-read').click();
    }
}

export default function updateAlarms() {
    return clearAndUpdateAlarms();
}