$(function(){
    $('.project-item').click(function(e){

        // 즐겨찾기 버튼 클릭 시 프로젝트 선택X
        if($(e.target).hasClass('flow-content-star')){
            return false;
        }
        
        $('#mainTop').css('display','none');
        $('#detailTop').css('display','block');
        $('#projectHomeLayer').css('display','none');
        $('#detailLayer').css('display','block');

    })

    // 사이드바의 메뉴, 프로젝트 카드, 로고 클릭 시 사이드바 메뉴 active 해제 (this 제외)
    $('.left-menu-item, .project-item, .logo-box').click(function(e){
        $('.left-menu-item').not(this).removeClass('flow-active');
        
        // 만약 로고 클릭 시, 내 프로젝트 active
        if($(this).hasClass('logo-box')){
            $('.left-menu-main').addClass('flow-active');
        }
    });
})