import {autoaccess} from './autoAccess.js'
$(function () {
 
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
        if(key.keyCode == 13 && !key.shiftKey){
            key.preventDefault();
            let accessToken = window.localStorage.getItem('accessToken')
            let memNo = window.localStorage.getItem('memNo')
            const rmNo= $(this).closest('li').attr('data-project-srno');
            const postNo= $(this).closest('li').attr('data-post-srno');
            let cmContent = this.innerText.trim();

            // shift+enter
            cmContent = cmContent.replace(/(\n|\r\n)/g, '<br>');

            let cmNo = 0;
            let ntTemp ='{';
            new Promise((succ,fail) => {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/posts/'+postNo+'/comments',
                    data: JSON.stringify({"postNo" : postNo, "cmContent" : cmContent, "cmWriter" : memNo}),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        succ(result);
                        cmNo=result.cmNo;
                        $('.project-item[data-id='+rmNo+']').click();
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                })
            }).then((arg)=>{
                // 현재 프로젝트 방 참여자 가져오기 (나 제외)
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8080/api/rooms/'+rmNo+'/members/'+memNo,
                    contentType: 'application/json; charset=utf-8',
                    async : false,
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        let arr = result
                        for(let i=0;i<result.length;i++){
                            if(i!=0){
                                ntTemp += ', '
                            }
                            ntTemp += '"'+result[i]+'" : null';
                        }
                        ntTemp += '}';
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            }).then((arg)=>{
                // 댓글 알람 보내기
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/notis/rooms/'+rmNo,
                    data: JSON.stringify({"ntTypeNo":2, "ntDetailNo":cmNo, "memNo":memNo, "rmNo":rmNo, "ntTemp":ntTemp}),
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        var socket = io.connect('http://localhost:3000');
                        socket.emit('test');
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            })
        }
   })
   
   $(document).on('click','.comment-writer-menu',function(e){
    let memNo = window.localStorage.getItem('memNo')
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
            $(document).on('keyup', '.edit-comment-input', function (key) { 
                let accessToken = window.localStorage.getItem('accessToken')
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
                                autoaccess()
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
                url: 'http://localhost:8080/api/posts/'+postNo+'/comments/'+cmNo+'/'+memNo,
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    $('.project-item[data-id='+rmNo+']').click();
                },
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });
        }
   })
});