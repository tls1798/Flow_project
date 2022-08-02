import {updatePopup} from './detailPopup.js';
import {readAllAlarmAjax, readAlarmAjax} from './ajax.js'

export function readAlarm(ntNo, postNo){
    let alarmCnt = $('#alarmUl li.on').length;
    let readAlarmCnt = $('#alarmUl li.on[data-post-no='+postNo+']').length;
    let leftAlarmCnt = alarmCnt-readAlarmCnt;

    readAlarmAjax(ntNo, postNo, leftAlarmCnt);
}

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
        var typeNo = $(this).attr('data-type-no');
        var rmNo = $(this).attr('data-project-no');
        let postNo = $(this).attr('data-post-no');

        if($(this).hasClass('on'))
            readAlarm($(this).attr('data-notis-no'), postNo);
        
        updatePopup(typeNo, rmNo, postNo);
    })
    
    // 모두 읽음
    $('#readAllAlarm').click(function(){
        readAllAlarmAjax();
    })
});