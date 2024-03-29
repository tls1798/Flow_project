import {getPostToCenterPopupAjax} from './ajax.js'
import {getFeed} from './changeMainContainer.js'

// 가운데 글 팝업 띄우기
const createPopup = function(typeNo, rmNo, postNo, cmNo){
    // 초대하기 알림이면 해당 피드로 이동
    if(typeNo==3){
        getFeed(rmNo);
        $('#postPopup').removeClass('flow-all-background-1');
    } else{
        getPostToCenterPopupAjax(rmNo, postNo, cmNo);
    }
}

// centerPostPopup 초기화 및 업데이트 함수
export function updatePopup(typeNo, rmNo, postNo, cmNo) {
    // 초기화
    $('#detailComment').children().remove();
    $('#popBack1>li').remove();
    $('#postPopup').addClass('flow-all-background-1');
    // centerPostPopup 업데이트
    createPopup(typeNo, rmNo, postNo, cmNo);
}

// 중앙 setting-button 닫기
export function centerSettingButtonClose(){
    $('html').click(function(e) {
        let centerSettingbool = $('#centerSettingList').css('display')=='block';
        // 글 수정, 삭제 버튼 영역 외 display none (setting 버튼 클릭할 시엔 X)
        if(centerSettingbool && !$(e.target).hasClass('.js-setting-ul.js-setting-layer.setup-group')) {
            $(".js-setting-ul.js-setting-layer.setup-group").addClass('d-none');
        }
    });
}

// 중앙 팝업 닫기
export function closeCenterPopup(){
    $('.close-detail').click(function(){
        $('#detailComment').children().remove();
        $('#popBack1>li').remove();
        $('#postPopup').removeClass('flow-all-background-1');
    })
}

// 중앙 팝업 영역 외 클릭 시 닫기
$('#popBack1').mousedown(function(e){
    if($(this).find("[id^='post-']").length > 0 && !$(e.target).closest('#rightPostCard').length>0 
        && !$(e.target).closest('#detailPostCard').length>0 && $('.create-post-wrap').css('display')=='none'){
            $('#detailComment').children().remove();
            $('#popBack1>li').remove();
            $('#postPopup').removeClass('flow-all-background-1');
    }
})

// setting-button 클릭 시 글 수정, 삭제 보이기
$(document).on('click','#centerSetting',function(e){
    if($('#centerSettingList').hasClass('d-none')){
        $('#centerSettingList').removeClass('d-none');
    } 
    else if(!$('#centerSettingList').hasClass('d-none')){
        $('#centerSettingList').addClass('d-none');
    }
    return false;
})