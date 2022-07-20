$(function(){

    // 글 생성 버튼 클릭 시 글 생성 팝업 보이기 
    $('#createPostArea').click(function(){
        $('.back-area.temp-popup').addClass('flow-all-background-1');
        $('.create-post-wrap').css('display','block');
        return false;
    })

    // 글 작성 닫기
    $('.btn-close').click(function(){

        // 내용 있을 때 확인 팝업
        const checkTitle = $(this).closest('.js-popup-before').find('#postTitle').val();
        const chekcContent = $(this).closest('.js-popup-before').find('.js-upload-area').text();
        if(checkTitle || chekcContent){
            $('#popupBackground').removeClass('d-none')
            $('.confirm-popup').removeClass('d-none')
            
        } else{
            $('.back-area.temp-popup').removeClass('flow-all-background-1');
            $('.create-post-wrap').css('display','none');
        }
    })
    $('.popup-confirm-warp').click(function(e){
        if(e.target.innerText=='취소'){
            $('#popupBackground').addClass('d-none')
            $('.confirm-popup').addClass('d-none')
        } else if(e.target.innerText='확인'){
            $('#popupBackground').addClass('d-none')
            $('.confirm-popup').addClass('d-none')
            $('.back-area.temp-popup').removeClass('flow-all-background-1');
            $('.create-post-wrap').css('display','none');
            $('.js-create-post-title.create-post-title').text('게시물 작성');
            $('.create-post-submit').removeClass('d-none');
            $('.js-editing-buttons').addClass('d-none');
            $('#postTitle').val('');
            $('.create-post-content').text('');
        }
        return false;
    })
    
    // $('.flow-pop-sub-button-1.cancel-event').click(function(){
    //     $('#popupBackground').addClass('d-none')
    //     $('.confirm-popup').addClass('d-none')
    // })

    // 글 작성 영역 클릭 시 닫기 안되게
    $('.create-post-wrap').click(function(e){

        // 글 쓰기 버튼 클릭 시
        if (e.target.type == 'submit') {
            let accessToken= window.localStorage.getItem('accessToken');
            let memNo= window.localStorage.getItem('memNo');
            const postTitle = $('#postTitle').val();
            const postContent = $('.create-post-content').text();
            const rmNo = $('#detailSettingProjectSrno').text();
            let postNo = 0;
            let ntTemp ='{';
            new Promise((succ, fail) =>{
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts',
                    data: JSON.stringify({"rmNo":rmNo, "postWriter":memNo, "postTitle":postTitle, "postContent":postContent}),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        succ(result);
                        postNo = result.postNo;
                        $('.project-item[data-id='+rmNo+']').click();
                    },
                    error: function (xhr, status, err) {
                    }
                });

            }).then((arg) => {

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
                    }
                });
            }).then((arg)=>{

                // 글 알림 보내기
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/notis/rooms/'+rmNo,
                    data: JSON.stringify({"ntTypeNo":1, "ntDetailNo":postNo, "memNo":memNo, "rmNo":rmNo, "ntTemp":ntTemp}),
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                    },
                    error: function (xhr, status, err) {
                    }
                });
            })

            $('#postTitle').val('');
            $('.create-post-content').text('');

        } 
        else{
            return false;
        }
    })

    // back-area 선택 시 사라지게
    $('#popBack1').click(function(e){
        
        // 내용 있을 때 확인 팝업
        const checkTitle = $('#postTitle').val();
        const chekcContent = $('.js-upload-area').text();
        if(checkTitle || chekcContent){
            $('#popupBackground').removeClass('d-none')
            $('.confirm-popup').removeClass('d-none')
            $('#popBack').click(function(e){
                $('#popupBackground').addClass('d-none')
                $('.confirm-popup').addClass('d-none')
            })
            
        }else{
            $('.back-area.temp-popup').removeClass('flow-all-background-1');
            $('.create-post-wrap').css('display','none');
        }
    })
    

    // $('html').click(function(e) {
    //     if(e.target.classList.contains('back-area')){
            
    //             // 글 작성 영역 외 클릭 시 닫기
    //             // $('.back-area.temp-popup').removeClass('flow-all-background-1');
    //             // $('.create-post-wrap').css('display','none');
    //             // $('.js-create-post-title.create-post-title').text('게시물 작성');
    //             // $('.create-post-submit').removeClass('d-none');
    //             // $('.js-editing-buttons').addClass('d-none');
    //             // $('#postTitle').val('');
    //             // $('.create-post-content').text('');
    

    //     } else{
    //         console.log(false)
    //     }

    // });
    
    

    
    $(document).on('click','.post-option>ul',function(e){
        // 글 수정
        if(e.target.id=='postEditBtn'){
            
            // 글 생성 팝업 띄우고 수정으로 변경
            $('.back-area.temp-popup').addClass('flow-all-background-1');
            $('.create-post-wrap').css('display','block');
            $('.js-create-post-title.create-post-title').text('글 수정');
            $('.create-post-submit').addClass('d-none');
            $('.js-editing-buttons').removeClass('d-none').css('display','inline-block');

            // 기존 값 가져오기
            const title = $(this).closest('.post-card-scroll').find('.post-title').text();
            const content = $(this).closest('.post-card-scroll').find('#originalPost').text();
            const rmNo = $(this).closest('li').attr('data-project-srno');
            const postNo = $(this).closest('li').attr('data-post-srno');
            $('#postTitle').val(title);
            $('.create-post-content').text(content);

            // 취소 버튼
            $('.cancel-button.create-post-button').click(function(e){
                $('.back-area.temp-popup').removeClass('flow-all-background-1');
                $('.create-post-wrap').css('display','none');
                $('.js-create-post-title.create-post-title').text('게시물 작성');
                $('.create-post-submit').removeClass('d-none');
                $('.js-editing-buttons').addClass('d-none');
                $('#postTitle').val('');
                $('.create-post-content').text('');
            })
            
            // 확인 버튼
            $('#createPostSubmit').click(function(){
                let accessToken = window.localStorage.getItem('accessToken');
                const editTitle = $(this).closest('.js-editor').find('input').val();
                const editContent = $(this).closest('.js-editor').find('.create-post-content').text();
                $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts/'+postNo,
                    data: JSON.stringify({"postTitle":editTitle, "postContent":editContent, "rmNo":rmNo, "postNo":postNo}),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        $('.back-area.temp-popup').removeClass('flow-all-background-1');
                        $('.create-post-wrap').css('display','none');
                        $('.js-create-post-title.create-post-title').text('게시물 작성');
                        $('.create-post-submit').removeClass('d-none');
                        $('.js-editing-buttons').addClass('d-none');
                        $('#postTitle').val('');
                        $('.create-post-content').text('');
                        $('.project-item[data-id='+rmNo+']').click();
                    },
                    error: function (xhr, status, err) {
                    }
                });
                
            })

        }
        else if(e.target.id=='postDelBtn'){
            // 글 삭제
            let accessToken = window.localStorage.getItem('accessToken');
            const rmNo = $(this).closest('li').attr('data-project-srno');
            const postNo = $(this).closest('li').attr('data-post-srno');
            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts/'+postNo,
                data: JSON.stringify({"rmNo":rmNo, "postNo":postNo}),
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
            
        return false
    })

})