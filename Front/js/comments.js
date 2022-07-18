$(function(){
    let accessToken= window.localStorage.getItem('accessToken');
    let memNo= window.localStorage.getItem('memNo');

//  엔터 시 줄 바꿈 막기
    $(document).on('keydown','.comment-input',function(key){      
        if(key.keyCode==13){
            if(!key.shiftKey){
                key.preventDefault();
            }
        }
    })
    // shift+enter 줄 바꿈 아직 미 구현, 엔터 시 값 가져오기 + ajax 통신
    $(document).on('keyup','.comment-input',function(key){      
        if(key.keyCode == 13){
            if(key.shiftKey){
                // 줄 바꿈
            }
            else{
                key.preventDefault();
                let accessToken = window.localStorage.getItem('accessToken');
                const rmNo= $(this).closest('li').attr('data-project-srno');
                const postNo= $(this).closest('li').attr('data-post-srno');
                const cmContent = this.innerText;
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/posts/'+postNo+'/comments',
                    data: JSON.stringify({"postNo" : postNo, "cmContent" : cmContent, "cmWriter" : memNo}),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        $('.project-item[data-id='+rmNo+']').click();
                    },
                    error: function (xhr, status, err) {
                    }
                })
            }
        }
   })

   
   $(document).on('click','.comment-writer-menu',function(e){

        // 댓글 수정
        if(e.target.id=='cmEditBtn'){
            const cmContent = $(this).closest('.comment-container').find('.comment-text').text();
            const cmNo = $(this).closest('li').attr('remark-srno')
            $(this).closest('.comment-container').removeClass('on');
            $(this).closest('.comment-container').next().addClass('on');
            $(this).closest('.comment-container').next().find('.edit-comment-input').text(cmContent);
            
            //  엔터 시 줄 바꿈 막기
            $(document).on('keydown','.edit-comment-input',function(key){      
                if(key.keyCode==13){
                    if(!key.shiftKey){
                        key.preventDefault();
                    }
                }
            })

            // shift+enter 줄 바꿈 아직 미 구현, 엔터 시 값 가져오기 + ajax 통신
            $(document).on('keyup','.edit-comment-input',function(key){      
                if(key.keyCode == 13){
                    if(key.shiftKey){
                        // 줄 바꿈
                    } 
                    else{
                        key.preventDefault();
                        let accessToken = window.localStorage.getItem('accessToken');
                        const rmNo= $(this).closest('[id^="post"]').attr('data-project-srno');
                        const postNo= $(this).closest('[id^="post"]').attr('data-post-srno');
                        const cmContent = this.innerText;
                        $.ajax({
                            type: 'PUT',
                            url: 'http://localhost:8080/api/posts/'+postNo+'/comments/'+cmNo,
                            data: JSON.stringify({"postNo" : postNo, "cmNo":cmNo, "cmContent" : cmContent, "cmWriter" : memNo}),
                            contentType: 'application/json; charset=utf-8',
                            beforeSend: function (xhr) {      
                                xhr.setRequestHeader("token",accessToken);
                            },
                            success: function (result, status, xhr) {
                                $('.project-item[data-id='+rmNo+']').click();
                            },
                            error: function (xhr, status, err) {
                            }
                        })
                    }
                }
            })


        }
        else if(e.target.id=='cmDelBtn'){
            // 댓글 삭제
            let accessToken = window.localStorage.getItem('accessToken');
            const rmNo = $(this).closest('li').parent().closest('li').attr('data-project-srno');
            const postNo = $(this).closest('li').parent().closest('li').attr('data-post-srno');
            const cmNo = $(this).closest('li').attr('remark-srno');
            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/api/posts/'+postNo+'/comments/'+cmNo,
                data: JSON.stringify({"postNo":postNo, "cmNo":cmNo}),
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
        }
   })
   
});