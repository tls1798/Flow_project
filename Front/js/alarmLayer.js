import {updatePopup} from './centerPostPopup.js';
import {readAllAlarmAjax, readAlarmAjax} from './ajax.js'

export function readAlarm(ntNo, postNo){
    let alarmCnt = $('#alarmUl li.on').length;
    let readAlarmCnt = $('#alarmUl li.on[data-post-no='+postNo+']').length;
    let leftAlarmCnt = alarmCnt-readAlarmCnt;

    readAlarmAjax(ntNo, postNo, leftAlarmCnt);
}

// 미확인 탭 클릭 -> 읽은 알림은 display none
$('.js-unread').click(function () {
    $('.js-unread').addClass('on');
    $('.js-read').removeClass('on');
    $('.js-alarm-item').not('.on').css('display', 'none');

    // 미확인 알림 없을 때 이미지
    if($('#alarmUl').find('li').hasClass('on')===true)
        $('#alarmUl').children('.js-project-null').css('display', 'none');
    else
        $('#alarmUl').children('.js-project-null').css('display', 'flex');
});

// 전체 탭 클릭 -> 읽은 알림 display block
$('.js-read').click(function () {
    $('.js-read').addClass('on');
    $('.js-unread').removeClass('on');
    $('.js-alarm-item').not('.on').css('display', 'block');

    // 미확인 알림 없을 때 이미지
    $('#alarmUl').children('.js-project-null').css('display', 'none');
});

// 알림 클릭 -> 알림 읽고, 가운데 글 팝업 띄우기
$('#alarmLayer').on('click', '.js-alarm-item', function (e) {
    var typeNo = $(this).attr('data-type-no');
    var rmNo = $(this).attr('data-project-no');
    let postNo = $(this).attr('data-post-no');

    if($(this).hasClass('on'))
        readAlarm($(this).attr('data-notis-no'), postNo);
    
    updatePopup(typeNo, rmNo, postNo);
})

// 알림레이어 알림 모두 읽음
$('#readAllAlarm').click(function(){
    readAllAlarmAjax();
})

// 닫기 버튼
$('.btn-close-layer').click(function(){
    $('#alarmLayer').css('display','none');    
}) 

// 알림레이어 클릭 -> 닫히지 않도록 return false
$('#alarmLayer').click(function(){
    return false;
});