$(function(){
    // 글 생성 버튼 클릭 시 글 생성 팝업 보이기 
    $('#createPostArea').click(function(){
        $('.back-area.temp-popup').addClass('flow-all-background-1');
        $('.create-post-wrap').css('display','block');
        return false;
    })
    // 글 작성 닫기
    $('.btn-close').click(function(){
        $('.back-area.temp-popup').removeClass('flow-all-background-1');
        $('.create-post-wrap').css('display','none');
    })
    // 글 작성 영역 클릭 시 닫기 안되게
    $('.create-post-wrap').click(function(){
        return false;
    })
    $('html').click(function(e) {
        // 글 작성 영역 외 클릭 시 닫기
        $('.back-area.temp-popup').removeClass('flow-all-background-1');
        $('.create-post-wrap').css('display','none');
    });
})