import logoutModule from './logoutModule.js';

$(function(){
    let accessToken= window.localStorage.getItem('accessToken');
    let memNo= window.localStorage.getItem('memNo');

    // profile li 클릭 시 팝업 띄우기
    $('#profileBtn').click(function(){
        // 프로필 모달 닫기
        $('#accountTopButton').removeClass('active');
        $(".modal-account").css('display', 'none');

        $('.back-area.temp-popup').addClass('flow-all-background-1');
        $('.profile-popup').css('display','block');
        return false;
    })

    // X 버튼
    $('.btn-close-profile-popup').click(function(){
        $('.back-area.temp-popup').removeClass('flow-all-background-1');
        $('.profile-popup').css('display','none');
        return false;
    })

    // 회원 탈퇴 버튼 클릭
    $('.btn-del-mem').click(function(){

        // 탈퇴
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/api/auth/members/temp/' + memNo,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function (result, status, xhr) {
                alert('성공');
            },
            error: function (xhr, status, err) {
                alert(err);
            }
        });

        // 로그아웃
        logoutModule();
    })

    // 초대 모달 1,2 클릭 시 display none X
    $('.profile-popup').click(function(){
        return false;
    });

    $('html').click(function() {
        // 초대 모달 1,2 display none
        if($('.profile-popup').css('display')=='block') {
            $('.back-area.temp-popup').removeClass('flow-all-background-1');
            $('.profile-popup').css('display','none');
        }
    });
})