import logoutModule from './logoutModule.js';
import updateAlarms from './socket.js'

// confirm 창 열기
const confirmOpen_logout = function(){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')

    $('.popup-confirm-warp').addClass('logout-confirm')
    $('#popBack2').addClass('logout-confirm-popback')
}
// confirm 창 닫기
const confirmClose_logout = function(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1');
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('logout-confirm')
    $('#popBack2').removeClass('logout-confirm-popback')
}

$(function(){
    // 모달, 팝업 display:none -> false, block -> true
    var searchPopupBool = false;
    // var alarmLayerBool = false;

    // 프로필 사진 클릭 시 프로필 모달 띄우기
    $(".btn-profile").click(function(e){
        if($('#accountLayer').css('display')=='none'){
            $(this).addClass('active');
            $(".modal-account").css('display', 'block');

            // html.click 동작시키지 않기 위해 작성
            // return false;
        }
    });

    // 로그아웃 클릭
    $('#logoutBtn').click(function () {
        $('.popup-cont').text('로그아웃 하시겠습니까?');
        confirmOpen_logout();
    })
    
    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function(e){
        if(!$(this).hasClass('logout-confirm'))
            return false;

        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose_logout();
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose_logout();
            logoutModule();
        } else {
            return false;
        }
    })

    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('logout-confirm-popback'))
            confirmClose_logout();
    })

    // 검색창 클릭 시 검색 팝업 띄우기
    $(".main-search").click(function(){
        if(!searchPopupBool){
            $(".name-type-seach-popup").css('display', 'block');
            searchPopupBool=!searchPopupBool;

            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    });

    // 알림 tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
        tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
    );
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })

    // 알림 아이콘 클릭 시 알림레이어 띄우기
    $('.btn-alarm').click(function(){
        // if(!alarmLayerBool){
        if($('#alarmLayer').css('display')=='none'){
            // 알림 업데이트
            updateAlarms();

            $("#alarmLayer").css('display', 'block');
        }
        else {
            $("#alarmLayer").css('display', 'none');
        }
    });

    $('html').click(function(e) {
        // 어디든 클릭하면 프로필 모달 display none
        if(!$(e.target).closest('#accountTopButton').length>0 && $('#accountLayer').css('display')=='block') {
            $(this).removeClass('active');
            $(".modal-account").css('display', 'none');
        }

        // 검색창 팝업 display none (검색창 팝업 클릭할 시엔 X)
        if(searchPopupBool && !$(e.target).hasClass('search-popup')) {
            $(".name-type-seach-popup").css('display', 'none');
            searchPopupBool=!searchPopupBool;
        }

        // 알림 레이어 display none (알림 버튼 클릭할 시엔 X)
        if(!$(e.target).closest('#alarmTopButton').length>0 && !$(e.target).hasClass('alarmLayer') && !($(e.target).closest('#popBack1').length>0) && !($(e.target).hasClass('close-detail'))) {
            $("#alarmLayer").css('display', 'none');
        }
    });
});