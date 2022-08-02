import {getPostToRightPostCardAjax} from './ajax.js'

// 오른쪽 글 카드 초기화
export function initRightPostCard(){
    $('#rightComment').children().remove();
    $('#popBack1>li').children().remove()
    $('#popBack1>li').remove();
}

// 오른쪽 글 카드 닫기
export function closeRightPostCard(){
    $('.close-side').click(function(){
        initRightPostCard();
    })
}

export function settingButtonClose(){
    $('html').click(function(e) {
        let rightSettingbool = $('#rightSettingList').css('display')=='block';
        // 글 수정, 삭제 버튼 영역 외 display none (setting 버튼 클릭할 시엔 X)
        if(rightSettingbool && !$(e.target).hasClass('.js-setting-ul.js-setting-layer.setup-group')) {
            $(".js-setting-ul.js-setting-layer.setup-group").addClass('d-none');
        }
    });
}

// 오른쪽 글 카드 초기화 및 업데이트 함수
export function updateRight(rmNo, postNo) {
    initRightPostCard();

    // 오른쪽 글 카드 업데이트
    getPostToRightPostCardAjax(rmNo, postNo);
}

// setting-button 클릭 시 글 수정, 삭제 보이기
$(document).on('click','#rightSetting',function(e){
    if($('#rightSettingList').hasClass('d-none')){
        $('#rightSettingList').removeClass('d-none');
    } 
    else if(!$('#rightSettingList').hasClass('d-none')){
        $('#rightSettingList').addClass('d-none');
    }
    return false;
})