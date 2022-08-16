// confirm 창 열기
export function confirmOpen(clsName){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('#popupBackground').removeClass('d-none');
    $('.confirm-popup').removeClass('d-none');

    $('.popup-confirm-warp').addClass(clsName);
    $('#popBack2').addClass(clsName);
}

// confirm 창 닫기
export function confirmClose(clsName){
    if($('#popBack1').children('li').length<=0)
        $('.back-area.temp-popup').removeClass('flow-all-background-1');

    $('#popupBackground').addClass('d-none');
    $('.confirm-popup').addClass('d-none');

    $('.popup-confirm-warp').removeClass(clsName);
    $('#popBack2').removeClass(clsName);
}

// CreatePost confirm 창 열기
export function confirmOpen_post(){
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')
    $('.popup-confirm-warp').addClass('post-confirm')
    $('#popBack2').addClass('post-confirm-popback')
    $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
}

// CreatePost confirm 창 닫기
export function confirmClose_post(){
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('post-confirm')
    $('#popBack2').removeClass('post-confirm-popback')
}