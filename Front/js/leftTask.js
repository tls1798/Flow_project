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
    
    // 새 프로젝트 버튼 클릭 시 display block
    $('.new-project-1').click(function(){
        $('.create-project').css('display', 'block');
        $('#templateReturnButton').css('display', 'block');
        $('.js-submit-project').html('프로젝트 만들기');
    });

    // 로고, 내 프로젝트 버튼 클릭 시 프로젝트 리스트 화면으로 + 내 프로젝트 메뉴 active
    $('.logo-box, .left-menu-main').click(function(){
        $('#mainTop').text('내 프로젝트')
        $('#mainTop').css('display', 'block');
        $('#detailTop').css('display','none');
        $('#projectHomeLayer').css('display','block');
        $('#feed').css('display','none');
        $('#allPostsLayer').css('display','none');
        $('.left-menu-main').addClass('flow-active');
    });
    // 북마크를 클릭시 북마크 리스트 화면으로
    $('.left-menu-bookmark').click(function () {
        $('#myPostContentUl').html('')
        $('#mainTop').text('북마크')
        $('#mainTop').css('display','block');
        $('#detailTop').css('display', 'none');
        $('#projectHomeLayer').css('display','none');
        $('#feed').css('display', 'none');
        $('#allPostsLayer').css('display', 'block');
    })
});