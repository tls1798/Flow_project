$(function(){
    // 프로젝트 디테일 창 display:none -> false, block -> true
    var proejctDetailBool = false;

    // 프로젝트 디테일 버튼 클릭 시
    $("#detailSettingTopButton").click(function(){
        if(!proejctDetailBool){
            $("#detailSettingLayer").css('display', 'block');
            proejctDetailBool=!proejctDetailBool;

            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    });
    
    // 프로젝트 디테일 창 클릭할 시엔 display none X
    $('#detailSettingLayer').click(function(){
        return false;
    });

    $('html').click(function() {
        // 프로젝트 디테일 창 display none
        if(proejctDetailBool) {
            $("#detailSettingLayer").css('display', 'none');
            proejctDetailBool=!proejctDetailBool;
        }
    });

    // 즐겨찾기 버튼
    $('#projectStar').click(function(e){
        // 즐겨찾기 해제 상태일 때
        if($(e.target).hasClass('unstar'))
            $(e.target).removeClass('unstar');
        else
            $(e.target).addClass('unstar');
    });

    // 프로젝트 나가기
    $('#detailSettingProjectExitBtn').click(function(){
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/api/room-members/7',
            data: JSON.stringify({"rmNo":9, "memNo":7}),
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {},
            error: function (xhr, status, err) {}
        });
    });

    // 프로젝트 수정
    $('#detailSettingProjectUpdateBtn').click(function(){
        $('.create-project').css('display', 'block');
        $('#createProjectButton').click();
        $('#templateReturnButton').css('display', 'none');
        $('.js-submit-project').html('수정');

        // 프로젝트 제목, 설명 넣기
    });

    // 프로젝트 삭제
    $('#detailSettingProjectDeleteBtn').click(function(){
        console.log('삭제버튼클릭');
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/api/rooms/7',
            //contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {},
            error: function (xhr, status, err) {}
        });
    });
});