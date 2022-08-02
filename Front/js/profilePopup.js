import {deleteMemberAjax, logoutAjax, getMemberAjax} from './ajax.js'

// confirm 창 열기
const confirmOpen_profile = function(){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')

    $('.popup-confirm-warp').addClass('profile-confirm')
    $('#popBack2').addClass('profile-confirm-popback')
}
// confirm 창 닫기
const confirmClose_profile = function(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1');
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('profile-confirm')
    $('#popBack2').removeClass('profile-confirm-popback')
}

$(function(){
    // profile li 클릭 시 팝업 띄우기
    $('#profileBtn').click(function(){
        // 프로필 모달 닫기
        $('#accountTopButton').removeClass('active');
        $(".modal-account").css('display', 'none');

        var memInfo = getMemberAjax(window.localStorage.getItem('memNo'), memInfo);
        
        // 이름, 이메일 넣기
        $('.info-box').find('span').text(memInfo.memName);
        $('#profileEml').find('span').text(memInfo.memMail);

        $('.back-area.temp-popup').addClass('flow-all-background-1');
        $('.profile-popup').css('display','block');

        return false;
    })

    // 참여자 클릭 시 팝업 띄우기
    $(document).on('click', '.js-participant-item', function(){
        var memInfo = getMemberAjax($(this).attr('data-id'), memInfo);

        // 이름, 이메일 넣기
        $('.info-box').find('span').text(memInfo.memName);
        $('#profileEml').find('span').text(memInfo.memMail);

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
        $('.popup-cont').text('정말로 탈퇴하시겠습니까?');
        confirmOpen_profile();
    })

    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function(e){
        if(!$(this).hasClass('profile-confirm'))
            return false;

        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose_profile();
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose_profile();
            deleteMemberAjax();
            logoutAjax();
        } else {
            return false;
        }
    })

    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('profile-confirm-popback'))
            confirmClose_profile();
    })

    // 초대 모달 1,2 클릭 시 display none X
    $('.profile-popup').click(function(){
        return false;
    });

    $('html').click(function() {
        // 초대 모달 1,2 display none
        if($('.profile-popup').css('display')=='block') {
            $('.btn-close-profile-popup').click();
        }
    });
})