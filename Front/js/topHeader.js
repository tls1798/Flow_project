import {updateAlarms} from './socket.js'
import {logoutAjax} from './ajax.js'
import {confirmOpen, confirmClose} from './confirm.js'

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
        confirmOpen('logout-confirm');
    })
    
    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function(e){
        if(!$(this).hasClass('logout-confirm'))
            return false;

        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose('logout-confirm');
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose('logout-confirm');
            logoutAjax();
        } else {
            return false;
        }
    })

    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('logout-confirm'))
            confirmClose('logout-confirm');
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
        if($('#alarmLayer').css('display')=='none'){
            // 알림 업데이트
            updateAlarms();
            
            if($('#rightPostCard').length>0){
                $('#popBack1>li').remove();
            }
            $("#alarmLayer").css('display', 'block');
        }
        else {
            $("#alarmLayer").css('display', 'none');
        }
    });
    
    // popBack이 열려있는지 확인
    let isPopBack = false;
    $('html').mousedown(function(e) {
        
        if(e.target.id == 'popBack1'){
            isPopBack = true;
        }
        else{
            isPopBack = false;
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
        if(!$(e.target).closest('#alarmTopButton').length>0 && !$(e.target).hasClass('alarmLayer') && !isPopBack && !($(e.target).hasClass('close-detail'))) {
            $("#alarmLayer").css('display', 'none');
        }
    });
});