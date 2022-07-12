$(function(){
    $('.button-close').click(function(){
        $('#projectSection').parent().css('display', 'none');
        $('.project-template-intro').css('display','flex');
        $('.project-template-main').css('display','none');
    });
    $('.button-create-template').click(function(){
        $('.project-template-intro').css('display','none');
        $('.project-template-main').css('display','flex');
    })
    $('.button-go-back').click(function(){
        $('.project-template-main').css('display','none');
        $('.project-template-intro').css('display','flex');
    })

    // 프로젝트 만들기, 수정
    $('.js-submit-project').click(function(){

        if($(this).html()=='프로젝트 만들기'){
            if($('#projectTitleInput').val()===""){
                $('.alert-wrap').css('display', 'block');
    
                setTimeout(function() {
                    $('.alert-wrap').fadeOut(500, "swing");
                }, 2000);
    
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/rooms',
                data: JSON.stringify({"rmTitle":$('#projectTitleInput').val(), "rmDes":$('#projectContentsInput').val(), "rmAdmin" : 1}),
                contentType: 'application/json; charset=utf-8',
                success: function (result, status, xhr) {},
                error: function (xhr, status, err) {}
            });
            
            // input, textarea 비우기
            $('#projectTitleInput').val('');
            $('#projectContentsInput').val('');

            // 생성한 프로젝트 피드로 이동
        }
        else{
            $.ajax({
                type: 'PUT',
                url: 'http://localhost:8080/api/rooms/9',
                data: JSON.stringify({"rmNo":10, "rmTitle":$('#projectTitleInput').val(), "rmDes":$('#projectContentsInput').val()}),
                contentType: 'application/json; charset=utf-8',
                success: function (result, status, xhr) {alert('성공');},
                error: function (xhr, status, err) {alert('실패');}
            });

            // input, textarea 비우기
            $('#projectTitleInput').val('');
            $('#projectContentsInput').val('');
        }

        // 새 프로젝트 생성 관련 모달 안보이도록
        $('#projectSection').parent().css('display', 'none');
        $('.project-template-intro').css('display','flex');
        $('.project-template-main').css('display','none');
    });
});