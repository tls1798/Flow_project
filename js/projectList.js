$(function(){
    $('.flow-content-star').click(function(e){
        // 즐겨찾기 해제 상태일 때
        if($(e.target).hasClass('flow-content-star-un'))
            $(e.target).removeClass('flow-content-star-un');
        else
            $(e.target).addClass('flow-content-star-un');
    });

})