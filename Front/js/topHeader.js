import {getSearchResultAjax, getMemberAjax, getAllAlarmsAjax} from './ajax.js'
import {confirmOpen, confirmClose} from './confirm.js'
import { erralert } from './bookmark.js'
import {logoutAjax} from './home.js'
// 모달, 팝업 display:none -> false, block -> true
var searchPopupBool = false;
let isPopBack = false;

$(function(){
    // 알림 tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
        tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
    );
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })
});

// 검색 팝업 초기화
const initSearchPopup = function(){
    $('.main-search-box input').val('');
    $('#searchPopupInput').val('');
    $('.search-popup-input .icon-search').removeClass('on');
    $('.search-popup-input .btn-search-delete').css('display','none');
    $('.main-search-box button').removeClass('active');
}

// 검색창 클릭 시 검색 팝업 띄우기
$(".main-search").click(function(e){
    // 검색 창 닫기 클릭 시
    if(e.target.type == 'button'){
        initSearchPopup();
        return;
    }

    // 검색어 있으면 클릭 시 검색 페이지 띄우기
    if($('.main-search-box input').val()!=''){
        $('#searchResult').removeClass('d-none');
        $('.top-setting-bar #topSettingBar').css('display', 'none');

        // title 변경
        $(document).prop('title', '플로우(flow) - 대한민국 No.1 올인원 협업툴');
    }

    if(!searchPopupBool){
        $(".name-type-seach-popup").css('display', 'block');
        searchPopupBool=!searchPopupBool;

        // 자동 포커싱
        $('#searchPopupInput').focus();

        // html.click 동작시키지 않기 위해 작성
        return false;
    }
});

// 검색 팝업 텍스트박스에서 엔터
$('#searchPopupInput').keypress(function(e){
    if (e.keyCode === 13) {
        $('.left-menu-item').removeClass('flow-active')
        // 검색 Ajax
        let searchItem = $('#searchPopupInput').val();
        
        // 내용 없으면 경고창
        if(searchItem===''){
            $('.alert-pop').children().children().text('검색어를 입력해주세요');
            erralert()
            return false;
        }
        getSearchResultAjax(searchItem);

        // 검색 팝업 닫기
        $(".name-type-seach-popup").css('display', 'none');
        searchPopupBool=!searchPopupBool;

        // 상단바 검색어 변경
        $('#searchWord').text(searchItem);

        // 검색 페이지 띄우기
        $('#searchResult').removeClass('d-none');
        $('.top-setting-bar #topSettingBar').css('display', 'none');

        // 검색창에 검색어 넣고 닫기 버튼 추가
        $('.main-search-box input').val('검색 : '+searchItem);
        $('.main-search-box button').addClass('active');

        // title 변경
        $(document).prop('title', '플로우(flow) - 대한민국 No.1 올인원 협업툴');
    }
});

// 검색 팝업에서 텍스트 작성 시 
$('#searchPopupInput').keyup(function(e){
    // 값 있을 때 닫기 버튼 display block, on class 추가
    if($('#searchPopupInput').val()!=''){
        $('.search-popup-input .icon-search').addClass('on');
        $('.search-popup-input .btn-search-delete').css('display','block');
    }
    // 값 없을 때 닫기 버튼 display none, on class 제거
    else{
        $('.search-popup-input .icon-search').removeClass('on');
        $('.search-popup-input .btn-search-delete').css('display','none');
    }
});

// 검색 팝업에서 닫기 버튼 클릭 시
$(document).on('click','.search-popup-input .btn-search-delete', function(e){
    initSearchPopup();
    $(".name-type-seach-popup").css('display', 'block');
    searchPopupBool=!searchPopupBool;
})

// 알림 아이콘 클릭 시 알림레이어 띄우기
$('.btn-alarm').click(function(){
    if($('#alarmLayer').css('display')=='none'){
        // 알림레이어 업데이트
        getAllAlarmsAjax();
        
        if($('#rightPostCard').length>0){
            $('#popBack1>li').remove();
        }
        $("#alarmLayer").css('display', 'block');
    }
    else {
        $("#alarmLayer").css('display', 'none');
    }
});

// 프로필 사진 클릭 시 프로필 모달 띄우기
$(".btn-profile").click(function(e){
    if($('#accountLayer').css('display')=='none'){
        // 사용자 프로필 업데이트
        var memInfo = getMemberAjax(window.localStorage.getItem('memNo'), memInfo);
        $('.user-info').find('strong').text(memInfo.memName);

        $(this).addClass('active');
        $(".modal-account").css('display', 'block');
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

$('html').mousedown(function(e) {
    if(e.target.id == 'popBack1')
        isPopBack = true;
    else
        isPopBack = false;
});

$('html').click(function(e) {
    // confirm 창 바깥 영역 클릭 시, return false
    if($(e.target).attr('id')=='popBack2')
        return false;

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
    if(!$(e.target).closest('#alarmTopButton').length>0 && !$(e.target).hasClass('alarmLayer') && 
        !isPopBack && !($(e.target).hasClass('close-detail')) && !$(e.target).closest('#detailPostCard').length>0) {
        $("#alarmLayer").css('display', 'none');
    }
});