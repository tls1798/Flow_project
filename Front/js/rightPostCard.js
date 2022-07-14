$(function(){
    // 글 카드 닫기
    $('.card-popup-close').click(function(){
       $('.back-area.temp-popup').css('display','none');
    })

    var postSettingBool = false;
    // setting-button 클릭 시 글 수정, 삭제 보이기
    $('.js-setting-button.set-btn').click(function(){
        if(!postSettingBool){
            $(".js-setting-ul.js-setting-layer.setup-group").css('display', 'block');
            postSettingBool=!postSettingBool;
            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    })

    $('html').click(function(e) {
        // 글 수정, 삭제 버튼 영역 외 display none (setting 버튼 클릭할 시엔 X)
        if(postSettingBool && !$(e.target).hasClass('.js-setting-ul.js-setting-layer.setup-group')) {
            $(".js-setting-ul.js-setting-layer.setup-group").css('display', 'none');
            postSettingBool=!postSettingBool;
        }
    });
})