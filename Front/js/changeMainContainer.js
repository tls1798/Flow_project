$(function(){
    $('.project-item').click(function(){
        $('#mainTop').css('display','none');
        $('#detailTop').css('display','block');
        $('#projectHomeLayer').css('display','none');
        $('#feedContainer').css('display','flex');
    })

    // 사이드바의 메뉴, 프로젝트 카드, 로고 클릭 시 사이드바 메뉴 active 해제 (this 제외)
    $('.left-menu-item, .project-item, .logo-box').click(function(e){
        $('.left-menu-item').not(this).removeClass('flow-active');
        
        // 만약 로고 클릭 시, 내 프로젝트 active
        if($(this).hasClass('logo-box')){
            $('.left-menu-main').addClass('flow-active');
        }
    });

    // 프로젝트 리스트 화면 띄울 땐 background-color : gray
    if($('.feedContents').css('display')=='block'){
        $('.main-container').css('background-color', 'gray');
    }
})