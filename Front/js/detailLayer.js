$(function(){
    // 참여자 영역 이동
    $(document).scroll(function(){
       $('#projectParticipants').css('transform', 'translateX(' + (0 - $(document).scrollLeft()) + 'px');
    });

    // 글 수정 삭제 창 display:none -> false, block -> true
    var postSettingBool = false;

    // 글 수정 삭제 디테일 버튼 클릭 시
    $("#postSetting").click(function(){
        if(!postSettingBool){
            $(".js-setting-layer").css('display', 'block');
            postSettingBool=!postSettingBool;
            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    });

    // 프로젝트 디테일 창 클릭할 시엔 display none X
    $('.js-setting-layer').click(function(){
        return false;
    });

    $('html').click(function() {
        // 프로젝트 디테일 창 display none
        if(postSettingBool) {
            $(".js-setting-layer").css('display', 'none');
            postSettingBool=!postSettingBool;
        }
    });

    // 글 고정
    $('.fixed-btn').click(function(e){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
        } else{
            $(this).addClass('on');
        }
    })

});