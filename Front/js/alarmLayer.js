$(function () {
    // 미확인, 전체 탭
    $('.js-unread').click(function () {
        $('.js-unread').addClass('on');
        $('.js-read').removeClass('on');
        $('.alarm-read').addClass('d-none')
    });
    $('.js-read').click(function () {
        $('.js-read').addClass('on');
        $('.js-unread').removeClass('on');
        $('.alarm-read').removeClass('d-none')
    });

    // 미확인 알림 클릭 시 removeClass('on')
    $('.js-alarm-item').click(function () {
        $(this).removeClass('on');
    });

    // 닫기 버튼
    $('.btn-close-layer').click(function(){
        $('#alarmLayer').css('display','none');    
    }) 

    $('#alarmLayer').click(function(){
        return false;
    });

    // 알림 누르면 글 정보 받아오는 API 
    $('#alarmLayer').on('click', '.js-alarm-item', function (e) {
        $(this).removeClass('on');
        // $('.js-alarm-item').on('click', function () {
        // console.log(this)
        let rmNo = $(this).attr('data-rn-id');
        let postNo = $(this).attr('data-pn-id');
        let accessToken = window.localStorage.getItem('accessToken');

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/rooms/' + rmNo + '/posts/' + postNo,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", accessToken);
            },
            success: function (result, status, xhr) {
                console.log(result)
            },
            error: function (xhr, status, err) {
                console.log('err')
            }
        });
    })
});