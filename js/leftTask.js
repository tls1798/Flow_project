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
});