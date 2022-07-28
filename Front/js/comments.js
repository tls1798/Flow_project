import {autoaccess} from './autoAccess.js'

// Date format
Date.prototype.YYYYMMDDHHMMSS = function () {
    var yyyy = this.getFullYear().toString();
    var MM = pad(this.getMonth() + 1, 2);
    var dd = pad(this.getDate(), 2);
    var hh = pad(this.getHours(), 2);
    var mm = pad(this.getMinutes(), 2)

    return yyyy+'-'+MM+'-'+dd+' '+hh+':'+mm;
};
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

// $(function () {
 
    //  엔터 시 줄 바꿈 막기
    $(document).on('keydown','.comment-input',function(key){      
        if(key.keyCode==13){
            if(!key.shiftKey){
                key.preventDefault();
            }
        }
    })

    // shift+enter 줄 바꿈, 엔터 시 값 가져오기 + ajax 통신
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

                        // 댓글 카운트 증가
                        let cnt = parseInt($(key.target).closest('li').find('.comment-count').text()) + 1;
                        $(key.target).closest('li').find('.comment-count').text(cnt);
                        
                        // 새로고침X, 바로 아래에 추가하기
                        $('.post-comment-group[data-id='+postNo+']').append(`
                            <li class="remark-item" remark-srno="`+ cmNo + `" data-user-id="` + memNo + `">
                                <div class="comment-thumbnail js-comment-thumbnail">
                                    <span class="thumbnail size40 radius16" data=""></span>
                                </div>
                                <div class="js-remark-view comment-container on ">
                                    <div class="comment-user-area">
                                        <div class="comment-user">
                                            <span class="user-name js-comment-user-name">`+ $('.user-info strong').text() + `</span>
                                            <span class="user-position"></span>
                                            <span class="record-date">`+ new Date().YYYYMMDDHHMMSS() + `</span>
                                        </div>
                                        <div id="`+memNo+`" class="comment-writer-menu">
                                            <button id="cmEditBtn" type="button" class="js-remark-update js-remark-edit-button comment-writer-button on">
                                                수정</button>
                                            <button id="cmDelBtn" type="button" class="js-remark-delete js-remark-edit-button comment-writer-button on">
                                                삭제</button>
                                        </div>
                                    </div>
                                    <div class="js-remark-layer comment-content">
                                        <div class="comment-text-area">
                                            <div class="js-remark-text comment-text"><div>`+ cmContent + `</div></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="js-remark-edit comment-container">
                                    <div class="js-remark-layer comment-content modify">
                                        <form class="js-remark-form comment-text-area">
                                            <fieldset>
                                                <legend class="blind">댓글 입력</legend>
                                                <div class="js-remark-area js-paste-layer edit-comment-input " contenteditable="true" placeholder="줄바꿈 Shift + Enter / 입력 Enter 입니다."></div>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                            </li>
                        `);

                        // text input 비우기
                        $('.comment-input').text('');
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
   
   let cmNo;
    $(document).on('click', '.comment-writer-menu',function(e){
        
        // 댓글 수정
        if(e.target.id=='cmEditBtn'){
            const cmContent = $(this).closest('.comment-container').find('.comment-text').text();
            cmNo = $(this).closest('li').attr('remark-srno');
            $(this).closest('.comment-container').removeClass('on');
            $(this).closest('.comment-container').next().addClass('on');
            $(this).closest('.comment-container').next().find('.edit-comment-input').text(cmContent);
            
            //  엔터 시 줄 바꿈 막기
            $(document).on('keydown', '.edit-comment-input',function(key){      
                if(key.keyCode==13){
                    if(!key.shiftKey){
                        key.preventDefault();
                    }
                }
            })

            // shift+enter 줄 바꿈, 엔터 시 값 가져오기 + ajax 통신
            $(document).on('keyup', '.edit-comment-input', function (key) { 
                let accessToken = window.localStorage.getItem('accessToken')
                if(key.keyCode == 13){
                    if(key.shiftKey){} // 줄 바꿈 
                    else{
                        key.preventDefault();
                        let accessToken = window.localStorage.getItem('accessToken');
                        let memNo = window.localStorage.getItem('memNo')
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
                                // text 수정
                                $('.remark-item[remark-srno='+cmNo+'] .comment-text').text(cmContent);
                                
                                // text input 닫기
                                $('.remark-item[remark-srno='+cmNo+'] .js-remark-view.comment-container').addClass('on');
                                $('.remark-item[remark-srno='+cmNo+'] .js-remark-edit.comment-container').removeClass('on');
                            },
                            error: function (xhr, status, err) {
                                autoaccess()
                            },
                        })
                    }
                }
            })
        }
        else if(e.target.id=='cmDelBtn'){

            // 댓글 삭제
            let accessToken = window.localStorage.getItem('accessToken');
            let memNo = window.localStorage.getItem('memNo')
            const rmNo = $(this).closest('li').parent().closest('li').attr('data-project-srno');
            const postNo = $(this).closest('li').parent().closest('li').attr('data-post-srno');
            const cmNo = $(this).closest('li').attr('remark-srno');
            
            let myCm = $(this).parents('.remark-item');

            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/api/posts/'+postNo+'/comments/'+cmNo+'/'+memNo,
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    
                    // 댓글 카운트 감소
                    let cnt = parseInt($(e.target).closest("[id^='post-']").find('.comment-count').text()) - 1;
                    $(e.target).closest("[id^='post-']").find('.comment-count').text(cnt);
                    myCm.remove();

                    var socket = io.connect('http://localhost:3000');
                    socket.emit('test');
                },
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });
        }
    })
    
// });