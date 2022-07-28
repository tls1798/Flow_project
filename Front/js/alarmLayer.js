import {autoaccess} from './autoAccess.js'
import updateAlarms from './socket.js'
import updatePopup from '../js/detailPopup.js';

let accessToken = window.localStorage.getItem('accessToken')
let memNo = window.localStorage.getItem('memNo')

$(function () {
    // 미확인, 전체 탭
    $('.js-unread').click(function () {
        $('.js-unread').addClass('on');
        $('.js-read').removeClass('on');
        $('.js-alarm-item').not('.on').css('display', 'none');

        // 미확인 알림 없을 때 이미지
        if($('#alarmUl').find('li').hasClass('on')===true)
            $('.js-project-null').css('display', 'none');
        else
            $('.js-project-null').css('display', 'flex');
    });
    $('.js-read').click(function () {
        $('.js-read').addClass('on');
        $('.js-unread').removeClass('on');
        $('.js-alarm-item').not('.on').css('display', 'block');

        // 미확인 알림 없을 때 이미지
        $('.js-project-null').css('display', 'none');
    });

    // 닫기 버튼
    $('.btn-close-layer').click(function(){
        $('#alarmLayer').css('display','none');    
    }) 

    $('#alarmLayer').click(function(){
        return false;
    });

    // 알림 클릭
    $('#alarmLayer').on('click', '.js-alarm-item', function (e) {
        if($(this).hasClass('on'))
            readAlarm($(this).attr('data-notis-no'));
        
        var ntNo = $(this).attr('data-notis-no');
        var typeNo = $(this).attr('data-type-no');
        var rmNo = $(this).attr('data-project-no');
        updatePopup(ntNo, typeNo, rmNo);
    })
    
    // 모두 읽음
    $('#readAllAlarm').click(function(){
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/api/notis/member/' + memNo,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", accessToken);
            },
            success: function (result, status, xhr) {
                updateAlarms();
            },
            error: function (xhr, status, err) {
                autoaccess()
            }
        });
    })
});

const readAlarmFunc = function(ntNo){
    // 알림 카운트 -1 (추후 같은 글/댓글 읽었을 경우 한꺼번에 처리)
    var cnt = parseInt($('#leftProjectHomeCount').text());
    if(cnt>1){
        $('#leftProjectHomeCount').text(cnt-1);
        $('#alarmTopCount').text(cnt-1);
        $('#projectNotReadCount').text(cnt-1);
    }else{
        $('#leftProjectHomeCount').css('display', 'none');
        $('#alarmTopCount').css('display', 'none');
        $('#projectAlarmArea').css('display', 'none');
    }

    // 해당 알림 피드 미확인, 알림레이어에서 지워지도록
    $('.js-alarm-item[data-notis-no='+ntNo+']').removeClass('on');
    $('.not-read-alarm-item[data-notis-no='+ntNo+']').remove();

    // 알림 4개 미만일 경우 더보기 버튼 display none
    if(cnt<4)
        $('#notReadAlarmMore').css('display', 'none');

    // 알림 확인 통신
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/notis/' + ntNo + '/member/' + memNo,
        data: JSON.stringify({"ntNo":ntNo, "memNo":memNo}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {},
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

export default function readAlarm(ntNo){
    return readAlarmFunc(ntNo);
}