$(function () {
    // 미확인, 전체 탭
    $('.js-unread').click(function () {
        $('.js-unread').addClass('on');
        $('.js-read').removeClass('on');
        $('.js-alarm-item').not('.on').css('display', 'none');
    });
    $('.js-read').click(function () {
        $('.js-read').addClass('on');
        $('.js-unread').removeClass('on');
        $('.js-alarm-item').not('.on').css('display', 'block');
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
        // 미확인 알림 removeClass('on')
        $(this).removeClass('on');

        // 알림 카운트 -1 (추후 같은 글/댓글 읽었을 경우 한꺼번에 처리)
        var cnt = parseInt($('#leftProjectHomeCount').text());
        if(cnt>1){
            $('#leftProjectHomeCount').text(cnt-1);
            $('#alarmTopCount').text(cnt-1);
        }else{
            $('#leftProjectHomeCount').css('display', 'none');
            $('#alarmTopCount').css('display', 'none');
        }

        let accessToken = window.localStorage.getItem('accessToken');
        let memNo= window.localStorage.getItem('memNo');

        // 알림 확인 통신
        var ntNo = $(this).attr('data-notis-no');
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/api/notis/' + ntNo + '/member/' + memNo,
            data: JSON.stringify({"ntNo":ntNo, "memNo":memNo}),
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", accessToken);
            },
            success: function (result, status, xhr) {},
            error: function (xhr, status, err) {}
        });
    })
});