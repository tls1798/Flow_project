$(function(){
    // 글 생성 버튼 클릭 시 글 생성 팝업 보이기 
    $('#createPostArea').click(function(){
        $('.back-area.temp-popup').addClass('flow-all-background-1');
        $('.create-post-wrap').css('display','block');
        return false;
    })
    // 글 작성 닫기
    $('.btn-close').click(function(){
        $('.back-area.temp-popup').removeClass('flow-all-background-1');
        $('.create-post-wrap').css('display','none');
    })
    // 글 작성 영역 클릭 시 닫기 안되게
    $('.create-post-wrap').click(function(e){
        if (e.target.type == 'submit') {
            let accessToken= window.localStorage.getItem('accessToken');
            let memNo= window.localStorage.getItem('memNo');
            const postTitle = $('#postTitle').val();
            const postContent = $('.create-post-content').text();
            const rmNo = $('#detailSettingProjectSrno').text();
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts',
                data: JSON.stringify({"rmNo":rmNo,"postWriter":memNo,"postTitle":postTitle, "postContent":postContent}),
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    $('.project-item[data-id='+rmNo+']').click();
                },
                error: function (xhr, status, err) {
                }
            });
            $('#postTitle').val('');
            $('.create-post-content').text('');

        } else{
            console.log(this)
            return false;
        }
    })
    $('html').click(function(e) {
        // 글 작성 영역 외 클릭 시 닫기
        $('.back-area.temp-popup').removeClass('flow-all-background-1');
        $('.create-post-wrap').css('display','none');
    });
})