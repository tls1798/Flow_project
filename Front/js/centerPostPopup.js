import {getPostToCenterPopupAjax} from './ajax.js'

// 가운데 글 팝업 띄우기
const createPopup = function(typeNo, rmNo, postNo){
    if(typeNo==3){
        $('.project-item[data-id='+rmNo+']').click();
        $('#postPopup').removeClass('flow-all-background-1');
    } else{
        getPostToCenterPopupAjax(rmNo, postNo);
    }
}

// centerPostPopup 초기화 및 업데이트 함수
export function updatePopup(typeNo, rmNo, postNo) {
    // 초기화
    $('#detailComment').children().remove();
    $('#popBack1>li').children().remove();
    $('#popBack1>li').remove();
    $('#postPopup').addClass('flow-all-background-1');
    // centerPostPopup 업데이트
    createPopup(typeNo, rmNo, postNo);
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