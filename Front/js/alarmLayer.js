$(function () {
    // 미확인, 전체 탭
    $('.js-unread').click(function () {
        $('.js-unread').addClass('on');
        $('.js-read').removeClass('on');
    });
    $('.js-read').click(function () {
        $('.js-read').addClass('on');
        $('.js-unread').removeClass('on');
    });

    // 미확인 알림 클릭 시 removeClass('on')
    $('.js-alarm-item').click(function () {
        $(this).removeClass('on');
    });

    $('#alarmLayer').click(function(){
        return false;
    });
});