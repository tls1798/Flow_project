import {autoaccess} from './autoAccess.js'
import updateRight from '../js/rightPostCard.js';

// 글 생성 팝업 열기
const postPopupOpen = function(){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('.create-post-wrap').css('display','block');
}
// 글 생성 팝업 닫기
const postPopupClose = function(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1');
    $('.create-post-wrap').css('display','none');
}
// confirm 창 열기
const confirmOpen = function(){
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')
    $('.popup-confirm-warp').addClass('post-confirm')
    $('#popBack2').addClass('post-confirm-popback')
    $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
}
// confirm 창 닫기
const confirmClose = function(){
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('post-confirm')
    $('#popBack2').removeClass('post-confirm-popback')
}
// 글 생성 팝업 초기화
const postInit = function(){
    $('.js-create-post-title.create-post-title').text('게시물 작성');
    $('.create-post-submit').removeClass('d-none');
    $('.js-editing-buttons').addClass('d-none');
}
// 제목, 내용 비우기
const postClear = function(){
    $('#postTitle').val('');
    $('.ProseMirror.toastui-editor-contents').empty();
}
// 글 수정으로 바꾸기
const postEditor = function(){
    $('.js-create-post-title.create-post-title').text('글 수정');
    $('.create-post-submit').addClass('d-none');
    $('.js-editing-buttons').removeClass('d-none').css('display','inline-block');
}

const toastEditor = function(){
    // Toast ui editor
    const Editor = toastui.Editor;
    const editor = new Editor({
        el: document.querySelector('#editor'),
        height: '600px',
        hideModeSwitch: true,
        toolbarItems:[
            ['bold', 'italic', 'strike'],
            ['ul', 'ol', 'task']
        ],
        initialEditType:'wysiwyg',
    });
}

// $(function(){

    // 글 생성 버튼 클릭 시 글 생성 팝업 보이기 
    $('#createPostArea').click(function(){
        postPopupOpen();
        toastEditor();
        postClear();
        return false;
    })

    // 글 작성 닫기
    $('.btn-close').click(function(){

        // 내용 있을 때 confirm 창
        const checkTitle = $(this).closest('.js-popup-before').find('#postTitle').val();
        const checkContent = $('.ProseMirror.toastui-editor-contents').text();
        if(checkTitle || checkContent){
            $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
            confirmOpen();
        } else{
            postPopupClose()
        }
    })
    
    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function(e){
        if(!$(this).hasClass('post-confirm'))
            return false;
        
        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose();
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose();
            postPopupClose();
            postInit();
            postClear();
        } else {
            return false;
        }
    })

    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('post-confirm-popback'))
            confirmClose();
    })

    // 글 작성 영역 클릭 시 닫기 안되게
    $('.create-post-wrap').click(function(e){

        // 글 쓰기 버튼 클릭 시
        if (e.target.type == 'submit') {
            // 내용 없으면 경고창
            const checkContent = $('.ProseMirror.toastui-editor-contents').text();
            if(checkContent===""){
                $('.alert-wrap-post').css('display', 'block');

                setTimeout(function() {
                    $('.alert-wrap-post').fadeOut(500, "swing");
                }, 2000);
    
                return;
            }

            let accessToken = window.localStorage.getItem('accessToken')
            let memNo = window.localStorage.getItem('memNo')
            const postTitle = $('#postTitle').val();
            const postContent = $('.ProseMirror.toastui-editor-contents')[0].innerHTML;
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
                        autoaccess()
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
                        autoaccess()
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
                        var socket = io.connect('http://localhost:3000');
                        socket.emit('test');
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            })

            postPopupClose();
            postClear();

        } 
        else{
            return false;
        }
    })

    // back-area 선택 시 사라지게
    $('#popBack1').mousedown(function(e){
        if(e.target.id=='popBack1' && $('.create-post-wrap').css('display')=='block'){
            
            // 내용 있을 때 confirm 창
            const checkTitle = $('#postTitle').val();
            const checkContent = $('.ProseMirror.toastui-editor-contents').text();
            if(checkTitle || checkContent){
                $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
                confirmOpen();
            }else{
                postPopupClose();
            }
        }
    })
    
    $(document).on('click', '.post-option>ul',function(e){
        // 글 수정
        if(e.target.id=='postEditBtn' || e.target.id=='rightEditBtn'){
            // 오른쪽 글 카드 있을 때
            if(e.target.id=='rightEditBtn'){
                $('#rightComment').children().remove();
                $('#popBack1').find('li').children().remove()
                $('#popBack1').find('li').remove();
            }

            // 글 생성 팝업 띄우고 수정으로 변경
            postEditor();
            postPopupOpen();
            toastEditor();
            
            // 기존 값 가져오기
            const title = $(this).closest('.post-card-scroll').find('.post-title').text();
            const content = $(this).closest('.post-card-scroll').find('#originalPost')[0].innerHTML;
            const rmNo = $(this).closest('li').attr('data-project-srno');
            const postNo = $(this).closest('li').attr('data-post-srno');
            $('#postTitle').val(title);
            $('.ProseMirror.toastui-editor-contents').html(content);

            // 취소 버튼
            $('.cancel-button.create-post-button').click(function(e){
                postPopupClose();
                postInit();
                postClear();
            })
            
            // 확인 버튼
            $("#createPostSubmit").off().on('click', function(){
                let accessToken = window.localStorage.getItem('accessToken')
                const editTitle = $(this).closest('.js-editor').find('input').val();
                const editContent = $('.ProseMirror.toastui-editor-contents')[0].innerHTML;
                $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts/'+postNo,
                    data: JSON.stringify({"postTitle":editTitle, "postContent":editContent, "rmNo":rmNo, "postNo":postNo}),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        postPopupClose();
                        postInit();
                        postClear();
                        $('.project-item[data-id='+rmNo+']').click();

                        // 오른쪽 글 카드
                        updateRight(rmNo, postNo);
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            })

        }
        else if(e.target.id=='postDelBtn' || e.target.id=='rightDelBtn'){

            // 글 삭제
            let accessToken = window.localStorage.getItem('accessToken');
            let memNo = window.localStorage.getItem('memNo');
            let rmNo = $(e.target).closest("[id^='post-']").attr('data-project-srno');
            const postNo = $(e.target).closest("[id^='post-']").attr('data-post-srno');
            
            // 오른쪽 글 카드 있을 때
            if(e.target.id=='rightDelBtn'){
                $('#rightComment').children().remove();
                $('#popBack1').find('li').children().remove()
                $('#popBack1').find('li').remove();
            }

            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts/'+postNo+'/'+memNo,
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    $('.project-item[data-id='+rmNo+']').click();

                    var socket = io.connect('http://localhost:3000');
                    socket.emit('test');
                },
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });
            
        }
            
        return false
    })
// }