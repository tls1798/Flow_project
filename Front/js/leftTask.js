$(function(){
    $('.left-menu-item').hover(function(){
        $(this).addClass('flow-hover');
    });
    $('.left-menu-item').mouseleave(function(){
        $(this).removeClass('flow-hover');
    });
    
    // 추후 내 프로젝트 화면이 hidden||display:none 되면 removeClass
    $('.left-menu-item').click(function(){
        $(this).addClass('flow-active');
    });
    
    // 새 프로젝트 생성 화면 load
    $(".create-project").load("./createProject.html");
    // 새 프로젝트 버튼 클릭 시 display block
    $('.new-project-1').click(function(){
        $('.create-project').css('display', 'block');
    });

    // 로고, 내 프로젝트 버튼 클릭 시 프로젝트 리스트 화면으로 + 내 프로젝트 메뉴 active
    $('.logo-box, .left-menu-main').click(function(){
        $('#mainTop').css('display','block');
        $('#detailTop').css('display','none');
        $('#projectHomeLayer').css('display','block');
        $('#feedContainer').css('display','none');

        $('.left-menu-main').addClass('flow-active');
    });
});