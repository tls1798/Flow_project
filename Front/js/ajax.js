import {autoaccess} from './autoAccess.js'
import {updateAlarms, elapsedTime} from './socket.js'
import {bookmarkList, alert} from './bookmark.js'
import {updateRight} from './rightPostCard.js';
import {postPopupClose, postInit, postClear} from './createPost.js'
import {updateList} from './projectList.js';
import {view, getPostAll} from './detailLayer.js';
import {closeCenterPopup} from './detailPopup.js';
import {closeRightPostCard, settingButtonClose} from './rightPostCard.js'

let accessToken = window.localStorage.getItem('accessToken')
let memNo = window.localStorage.getItem('memNo')

// 알림 모두 가져오기
export function getAllAlarmsAjax(){
    new Promise((succ,fail)=>{
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/notis/member/' + memNo,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", accessToken);
            },
            success: function (result, status, xhr) {
                succ(result);
    
                // 미확인 알림 count
                var cnt = 0;
    
                // 읽음 여부 확인해서 미확인/전체 나누기 (미확인이면 addClass('on'))
                for(var i=0; i<result.length; i++){
    
                    // 읽음 여부
                    var checked;
                    if(result[i].ntTemp[memNo]==null){
                        checked = `<li class="js-alarm-item on" data-project-no=`+result[i].rmNo+` data-notis-no=`+result[i].ntNo
                            +` data-type-no=`+result[i].ntTypeNo+ ` data-detail-no=`+result[i].ntDetailNo+` data-post-no=`+result[i].postNo+`>`;
                        ++cnt;
                    }
                    else
                        checked = `<li class="js-alarm-item" data-project-no=`+result[i].rmNo+` data-notis-no=`+result[i].ntNo
                            +` data-type-no=`+result[i].ntTypeNo+ ` data-detail-no=`+result[i].ntDetailNo+` data-post-no=`+result[i].postNo+`>`;
                    
                    // 알림 종류에 따른 문구
                    var des;
                    var content = `<div class="all-text-wrap-type-3 alarm-cont">`+result[i].notiContent+`</div>`;
                    if(result[i].ntTypeNo==1)
                        des = `님의 글 등록`;
                    else if(result[i].ntTypeNo==2)
                        des = `님의 댓글 등록`;
                    else{
                        des = `님이 초대합니다`;
                        content = ``;
                    }
    
                    $('#alarmUl').append(
                        checked+`   
                            <div class="all-setup-picture-type-1"
                                style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)"></div>
                            <div class="all-text-wrap-type-1">
                                <div class="all-setup-section-type-1">
                                    <span>`+result[i].rmTitle+`</span><em class="alarm-datetime">`+elapsedTime(result[i].ntDatetime)+`</em>
                                </div>
                                <div class="all-text-wrap-type-2 alarm-tit-ellipsis">`+result[i].memName+des+`</div>
                                `+content+`
                            </div>
                        </li>
                    `);
                }
    
                // 알림 count
                if(result.length>0 && result[0].ntCount!=0){
                    $('#leftProjectHomeCount').css('display', 'inline-block');
                    $('#alarmTopCount').css('display', 'block');
                    $('#leftProjectHomeCount').text(result[0].ntCount);
                    $('#alarmTopCount').text(result[0].ntCount);
                }else{
                    $('#leftProjectHomeCount').css('display', 'none');
                    $('#alarmTopCount').css('display', 'none');
                }
    
                // 알림 레이어에 모두 추가하고, 현재 on 상태인 탭 click
                if ($('.js-read').hasClass('on'))
                    $('.js-read').click();
                else
                    $('.js-unread').click();
            },
            error: function (xhr, status, err) {
                autoaccess()
            }
        });
    }).then((arg)=>{
        // change 이벤트 일으켜서 피드 미확인도 갱신하도록 함
        $('#alarmTopCount').change();
    })
}

// 알림레이어에서 알림 모두 읽기
export function readAllAlarmAjax() {
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/notis/member/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            updateAlarms();
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 프로젝트별 알림 모두 읽기
export function readAllAlarmsByProjectAjax() {
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/notis/member/' + memNo + '/rooms/' + $('#detailSettingProjectSrno').text(),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            updateAlarms();
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 알림 하나 읽기
export function readAlarmAjax(ntNo, postNo, leftAlarmCnt){
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/notis/' + ntNo + '/member/' + memNo,
        data: JSON.stringify({"ntNo":ntNo, "memNo":memNo, "postNo":postNo}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            // 알림 카운팅
            if(leftAlarmCnt>0){
                $('#leftProjectHomeCount').text(leftAlarmCnt);
                $('#alarmTopCount').text(leftAlarmCnt);
                $('#projectNotReadCount').text(leftAlarmCnt);
            }else{
                $('#leftProjectHomeCount').css('display', 'none');
                $('#alarmTopCount').css('display', 'none');
                $('#projectAlarmArea').css('display', 'none');
            }
        
            // 해당 알림 + 연관된 알림 피드 미확인, 알림레이어에서 지워지도록
            $('.js-alarm-item[data-notis-no='+ntNo+']').removeClass('on');
            $('.js-alarm-item[data-post-no='+postNo+']').removeClass('on');
            $('.not-read-alarm-item[data-notis-no='+ntNo+']').remove();
            $('.not-read-alarm-item[data-post-no='+postNo+']').remove();
        
            // 알림 4개 미만일 경우 더보기 버튼 display none
            if(leftAlarmCnt<4)
                $('#notReadAlarmMore').css('display', 'none');

            // change 이벤트 일으켜서 피드 미확인도 갱신하도록 함
            $('#alarmTopCount').change();
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 내 북마크 목록 읽어오기
export function getBookmarkAjax(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/bookmark/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {

            // 북마크 개수
            $('#postCount').text(result.length);

            for(let i=0;i<result.length;i++){
                $('#myPostContentUl').append(`
                    <li class="js-all-post-item post-search-item post-list-wrapper booklist" data-project-id="`+ result[i].rmNo + `"data-post-id="` + result[i].postNo + `" data-mem-id="` + result[i].memNo + `">
                        <div class="fixed-kind">
                            <i class="bi bi-card-text"></i>
                            <span class="post-type">글</span>
                        </div>
                        <div class="search-sub-text-wrap">
                            <div class="contents-cmt">
                                <p class="search-text-type-3 contents-tit">`+ result[i].postTitle + `</p>
                                <div class="post-list comment" style="display:inline-block" data="">
                                    <i class="bi bi-chat-square-text"></i>
                                    <span class="js-post-comment-count">`+ result[i].cmCount + `</span>
                                </div>
                            </div>
                            <p class="search-text-type-3 contents-project">
                                <em class="ellipsis"><i class="seach-type-2"></i>`+ result[i].rmTitle + `</em>
                            </p>
                        </div>
                        <div class="post-list-right">
                            <div class="post-list name">`+ result[i].memName + `</div>
                            <div class="post-list date">`+ result[i].postDatetime + `</div>
                            <!--
                            <div class="fixed-value">
                                <span class="state request" style="display:none" data>-1%</span>
                                <span class="js-task-state state " ></span>
                                <div class="date-time" style="display:none" data>
                                    <em class="date"></em>
                                    <span></span>
                                </div>
                            </div>
                            -->
                        </div>
                        <i class="js-temporary-delete icons-close-2 d-none" style="display:none" data=""></i>
                    </li>
                `)
            }
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 북마크 삭제
export function removeBookmarkAjax(postNo){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/bookmark',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({"memNo": memNo,"postNo": postNo}),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            alert();
            bookmarkList();
        },
        error: function (xhr, status, err) {
            autoaccess();
        }
    });
}

// 북마크 추가
export function addBookmarkAjax(postNo){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/bookmark',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({"memNo": memNo,"postNo": postNo}),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            alert();
            bookmarkList();
        },
        error: function (xhr, status, err) {
            autoaccess();
        }
    });
}

// 내가 속한 프로젝트 방 모두 조회
export function getAllRoomsAjax(rmNo){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/rooms/'+rmNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            // 내가 관리자일 경우
            if(result.rmAdmin==memNo){
                $('#detailSettingProjectExitBtn').css('display', 'none');
                $('#detailSettingProjectUpdateBtn').css('display', 'block');
                $('#detailSettingProjectDeleteBtn').css('display', 'block');
            }
            // 참여자일 경우
            else{
                $('#detailSettingProjectExitBtn').css('display', 'block');
                $('#detailSettingProjectUpdateBtn').css('display', 'none');
                $('#detailSettingProjectDeleteBtn').css('display', 'none');
            }
        },
        error: function (xhr, status, err) {    
            autoaccess()
        }
    });
}

// 멤버 정보 가져오기 (프로필 상세 팝업)
export function getMemberAjax(memNo, memInfo){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/member/'+memNo,
        contentType: 'application/json; charset=utf-8',
        async: false,
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            memInfo = result;
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });

    return memInfo;
}

// 모든 회원 조회 (초대 팝업)
export function getAllMembers(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/members',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            if(result.length == 0){
                $('.invite-blank-txt').removeClass('d-none');
            }
            else {
                for(var i=0; i<result.length; i++){
                    $('.project-invite-choiceList').append(`
                        <li class="js-member-item" data-id="`+result[i].memNo+`" data-name="`+result[i].memName+`">
                            <div class="my-check-2 js-select-Btn"></div>
                            <div class="post-author">
                                <span class="js-profile thumbnail size40 radius16"
                                    style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)"
                                    data=""></span>
                                <dl class="post-author-info">
                                    <dt>
                                        <strong id="name" class="author">`+result[i].memName+`</strong>
                                        <em></em>
                                    </dt>
                                    <dd>
                                        <strong class="company"></strong>
                                        <span class="team"></span>
                                    </dd>
                                </dl>
                            </div>
                        </li>
                    `);
                }
            }
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 회원 초대
export function addMembersToProject(jsonData, rmNo, ntTemp){
    new Promise((succ,fail)=>{
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/room-members',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function (result, status, xhr) {
                succ(result)
                // 참여자 업데이트
                $('.project-item[data-id='+rmNo+']').click();
            },
            error: function (xhr, status, err) {
                autoaccess()
            }
        });
    }).then((arg)=>{
        // 초대 알림 보내기
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/notis/rooms/'+rmNo,
            data: JSON.stringify({"ntTypeNo":3, "ntDetailNo":null, "memNo":memNo, "rmNo":rmNo, "ntTemp":ntTemp, "postNo":null}),
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

// 현재 프로젝트 방 참여자 가져오기 (나 제외)
export function getParticipantsWithoutMeAjax(rmNo, ntTemp){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/rooms/'+rmNo+'/members/'+memNo,
        contentType: 'application/json; charset=utf-8',
        async : false,
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
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

    return ntTemp;
}

// 댓글 작성
export function addCommentAjax(key, rmNo, postNo, cmContent, ntTemp, cmNo){
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
                cmNo = result.cmNo;

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
        ntTemp = getParticipantsWithoutMeAjax(rmNo, ntTemp);
    }).then((arg)=>{
        // 댓글 알람 보내기
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/notis/rooms/'+rmNo,
            data: JSON.stringify({"ntTypeNo":2, "ntDetailNo":cmNo, "memNo":memNo, "rmNo":rmNo, "ntTemp":ntTemp, "postNo":postNo}),
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

// 댓글 수정
export function editCommentAjax(postNo, cmContent, cmNo){
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
            $('.remark-item[remark-srno='+cmNo+'] .comment-text').html('<div>'+cmContent+'</div>');
            
            // text input 닫기
            $('.remark-item[remark-srno='+cmNo+'] .js-remark-view.comment-container').addClass('on');
            $('.remark-item[remark-srno='+cmNo+'] .js-remark-edit.comment-container').removeClass('on');
        },
        error: function (xhr, status, err) {
            autoaccess()
        },
    })
}

// 댓글 삭제 기존 댓글은 안되고 새로 단 댓글은 됨 개빡침
export function removeCommentAjax(e, postNo, cmNo, myCm){
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

// 글 작성
export function addPostAjax(rmNo, postNo, postTitle, postContent, ntTemp){
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
        ntTemp = getParticipantsWithoutMeAjax(rmNo, ntTemp);
    }).then((arg)=>{
        // 글 알림 보내기
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/notis/rooms/'+rmNo,
            data: JSON.stringify({"ntTypeNo":1, "ntDetailNo":postNo, "memNo":memNo, "rmNo":rmNo, "ntTemp":ntTemp, "postNo":postNo}),
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

// 글 수정
export function editPostAjax(rmNo, postNo, editTitle, editContent){
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
}

// 글 삭제
export function removePostAjax(rmNo, postNo){
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

// 프로젝트 생성
export function addProjectAjax(rmNo){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/rooms',
        data: JSON.stringify({"rmNo":rmNo, "rmTitle":$('#projectTitleInput').val(), 
            "rmDes":$('#projectContentsInput').val(), "rmAdmin" : memNo}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            // 프로젝트 리스트 업데이트
            updateList();
            // 해당 프로젝트 피드로 이동
            // 리팩토링 후 모듈 사용 (getRoom, updateParticipant, getPostAll, display 수정)
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 프로젝트 수정
export function editProjectAjax(title, content){
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/rooms/'+$('#detailSettingProjectSrno').text(),
        data: JSON.stringify({"rmNo":$('#detailSettingProjectSrno').text(), "rmTitle":title, "rmDes":content}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            // topSettingBar 수정
            $('#projectTitle').text(title);
            $('#projectContents').text(content);
            
            // input, textarea 비우기
            $('#projectTitleInput').val('');
            $('#projectContentsInput').val('');
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 프로젝트 나가기
export function exitProjectAjax(){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/room-members/'+$('#detailSettingProjectSrno').text(),
        data: JSON.stringify({"rmNo":$('#detailSettingProjectSrno').text(), "memNo":memNo}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            // 프로젝트 리스트 업데이트
            updateList();
            // 로고 클릭하여 프로젝트 리스트로
            $('.logo-box').click();
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 프로젝트 삭제
export function removeProjectAjax(){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/rooms/'+$('#detailSettingProjectSrno').text(),
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            // 프로젝트 리스트 업데이트
            updateList();
            // 로고 클릭하여 프로젝트 리스트로
            $('.logo-box').click();
            
            var socket = io.connect('http://localhost:3000');
            socket.emit('test');
        },
        error: function (xhr, status, err) {        
            autoaccess()    
        }
    });
}

// 상단고정 등록
export function addPinAjax(bool, postNo, postPin, getpinPosts){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/rooms/posts/' + postNo + '/pin/' + postPin,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            getPostAll(getpinPosts)
            $('#detailComment').children().remove();
            bool = 1;
        },
        error: function (xhr, status, err) {
            autoaccess();
        }
    });

    return bool;
}

// 피드 우측 참여자 가져오기
export function getAllParticipantsAjax(rmNo){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/rooms/' + rmNo + '/members',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {

            // 초기화
            $('#participantsUl').find('li').remove();

            // 총 참여자 수 수정
            $('#participantCount').text(result.length);
            // 관리자 제외 참여자 수 수정
            $('#outerParticipantsCount').text(result.length - 1);

            // 프로젝트 관리자
            $('.participants-admin-span').append(`
                <li class="js-participant-item" data-id="`+ result[0].rmAdmin + `">
                    <div class="post-author">
                        <span class="js-participant-profile thumbnail size40 radius16" data=""></span>
                        <dl class="post-author-info">
                            <dt>
                                <strong class="js-participant-name author ellipsis">`+ result[0].adminName + `</strong>
                                <em class="position ellipsis" style="display:none" data=""></em>
                            </dt>
                        </dl>
                    </div>
                </li>
            `);

            // 참여자
            for (var i = 0; i < result.length; i++) {
                // 관리자면 참여자에 추가하지 않음
                if (result[i].memNo == result[i].rmAdmin) continue;

                $('.participants-member-span').append(`
                    <li class="js-participant-item" data-id="`+ result[i].memNo + `" >
                        <div class="post-author">
                            <span class="js-participant-profile thumbnail size40 radius16" data=""></span>
                            <dl class="post-author-info">
                                <dt>
                                    <strong class="js-participant-name author ellipsis">`+ result[i].memName + `</strong>
                                    <em class="position ellipsis" style="display:none" data=""></em>
                                </dt>
                            </dl>
                        </div>
                    </li>
                `);
            }

            // 관리자만 존재하고 참여자는 0명일 경우 span display:none
            if (result.length == 1)
                $('.participants-member-span').css('display', 'none');
            else
                $('.participants-member-span').css('display', 'block');
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 피드 내 글/댓글 가져오기
export function getAllPostsByProjectAjax(rmNo){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/members/'+ memNo +'/rooms/'+ rmNo +'/posts',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            
            var count = 0;
            $('#pinPostUl').html('')
            // 초기화
            $('#detailUl').find('li').remove();
            $('#detailUl').find('div').remove();
            
            // 게시글 없을 때
            if (result.length == 0) {
                $('#detailUl').append(`
                    <div id="noDetailData" class="detail-data-none">
                        <img src="https://flow.team/flow-renewal/assets/images/none_member.png" alt="함께할 멤버들을 지금 초대해 보세요!"/>
                        <p class="none-text">아직 참여중인 멤버들이 없습니다<br>
                            함께할 멤버들을 지금 초대해 보세요!</p>
                        <button id="noDetailDataBnt" type="button" class="data-none-button invite">초대하기</button>
                    </div>
                `);
            } else {
                
                // 게시글 있을 때
                for (var i = 0; i < result.length; i++) {
                    let commentcount = 0;
                    // 상단고정일 경우
                    if (result[i].posts.postPin) {
                        count++;
                        $('#pinPostUl').append(
                            `<li id="post-`+result[i].posts.postNo+`" class="js-pin-item" index="4" data-project-srno="`+rmNo+`" data-post-srno="`+result[i].posts.postNo+`" data-post-pin="`+result[i].posts.postPin+`" >
                                            <a href="#">
                                                <div class="fixed-kind">
                                                    <i class="icons-write2"></i>
                                                    <span>글</span>
                                                </div>
                                                <p class="js-post-title fixed-text ">`+ (result[i].posts.postTitle==''?result[i].posts.postContent:result[i].posts.postTitle) + `</p>
                                                <div class="fixed-value">
                                                    <span class="js-task-state js-todo-state d-none"></span>
                                                    <div class="date-time d-none">
                                                        <em class="date"></em>
                                                        <span></span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>`
                        )
                    }
                    $('#detailUl').append(`
                        <li id="post-`+result[i].posts.postNo+`" class="js-popup-before detail-item back-area" data-read-yn="Y" data-comment-count="0"  data-project-srno="` + rmNo + `" data-post-srno="` + result[i].posts.postNo + `" data-post-pin= "`+ result[i].posts.postPin +`" data-remark-srno="" data-bookmark="`+result[i].posts.postBookmark+`" data-section-srno=""  mngr-wryn="" mngr-dsnc="" data-post-code="1" pin-yn="N" time="" data-code="VIEW" data-post-url="https://flow.team/l/04vvh"">
                            <div class="js-post-nav card-item post-card-wrapper write2 ">
                                <div class="post-card-header">
                                    <div class="post-card-scroll">
                                        <div class="card-header-top">
                                            <div class="post-author js-post-author" data-author-id="`+ result[i].posts.postName + `">
                                                <span class="thumbnail size40 radius16" data=""></span>
                                                <dl class="post-author-info">
                                                    <dt>
                                                        <strong class="author ellipsis">`+ result[i].posts.postName + `</strong>
                                                        <em class="position ellipsis" style="display:inline" data=""></em>
                                                        <span class="date">`+ result[i].posts.postDatetime + `</span>
                                                        <span class="post-security"> <i class="bi bi-people" mouseover-text="전체 공개"></i></span>
                                                    </dt>
                                                </dl>
                                            </div>
                                            <div id = "option-`+ result[i].posts.postNo + `">
                                                <div class="post-option">
                                                    <button id="movePost" class="btn-go" style="display: none;">
                                                        게시글 바로가기
                                                    </button>
                                                    <button id="pin-`+ result[i].posts.postNo + `" class="js-pin-post fixed-btn js-pin-authority" data-project-srno="` + rmNo + `" data-post-srno="` + result[i].posts.postNo + `"  data-post-pin= "` + result[i].posts.postPin + `" style="display:block" data="">
                                                        <!-- fixed-btn on class -->
                                                        <span class="blind">상단 고정 등록</span>
                                                    </button>
                                                    <button id="postSetting" class="js-setting-button set-btn" data-mem-id="`+ result[i].posts.postWriter + `">
                                                        <i class="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul class="js-setting-ul js-setting-layer setup-group d-none">
                                                        <li class="js-setting-item" data-code="modify" style="display:block" data="">
                                                            <a id="postEditBtn" href="#"><i class="bi bi-card-text"></i>수정</a>
                                                        </li>
                                                        <li id='auth-delete' class="js-setting-item" data-code="delete" style="display:block" data="">
                                                            <a id="postDelBtn" href="#"> <i class="bi bi-trash"></i>삭제</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="js-card-header-bottom card-header-bottom ">
                                            <div class="post-title-area">
                                                <h4 class="js-post-title post-title ">`+ result[i].posts.postTitle + `</h4>
                                            </div>
                                        </div>
                                        <div class="post-card-container">
                                            <div id="originalPost" class="post-card-content " style="display:block" data=""><div id="viewer" class="viewer`+ result[i].posts.postNo + `" >` + result[i].posts.postContent + `</div></div>
                                            <div id="summaryPost" class="post-card-content hidden" style="display:none" data=""><div>`+ result[i].posts.postContent + `</div></div>
                                            <button id="postMoreButton" type="button" class="js-contents-more-btn post-more-btn" style="display:none" data="">더보기</button>
                                            <div id="summaryFoldArea" class="content-fold" style="display:none" data=""></div>
                                            <div class="post-bottom-area">
                                                <div class="post-bottom-menu js-reaction-bookmark">
                                                    <div class="bottom-button-area">
                                                        <button class="js-post-bookmark post-bottom-button" id="bookmark-`+ result[i].posts.postNo + `" data-pst-id="` + result[i].posts.postNo + `" data-book-value="0">
                                                            <i class="icon-bookmark"></i>
                                                            <span>북마크</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="cmt-read-wr">
                                                    <div class="comment-count-area">
                                                        <span>댓글</span>
                                                        <span class="comment-count">`+ result[i].commentsList.length + `</span>
                                                    </div>
                                                    <div class="js-read-check-button read-confirmation" style="display:block" data="">
                                                        <span>읽음</span>
                                                        <span class="confirmation-number">1</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="post-card-footer js-comment-area" >
                                            <div class="comment-header">
                                                <button type="button" class="js-remark-prev-button comment-more-button d-none">
                                                    이전 댓글 더보기 (<span id="cm-count-id">0</span>)
                                                </button>
                                            </div>
                                            <ul class="post-comment-group" data-id="`+ result[i].posts.postNo + `"></ul>
                                        </div>
                                        <div class="js-remark-layer js-edit-layer comment-input-wrap" >
                                            <div class="comment-thumbnail">
                                                <span class="thumbnail size40 radius16" data=""></span>
                                            </div>
                                            <form class="js-remark-form comment-container on ">
                                                <fieldset>
                                                    <legend class="blind">댓글 입력</legend>
                                                    <div class="js-remark-area js-paste-layer comment-input" contenteditable="true" placeholder="줄바꿈 Shift + Enter / 입력 Enter 입니다."></div>
                                                </fieldset>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `)

                    // 자신의 글이 아니면 상단고정 , 메뉴를 안보이게 한다
                    if (result[i].posts.postWriter != memNo) {
                        $('#option-' + result[i].posts.postNo + '').remove()
                    }
                    
                    // 상단 고정이면 클래스 on을 추가해준다
                    if (result[i].posts.postPin == 1) {
                        $('#pin-' + result[i].posts.postNo + '').addClass('on')
                    }

                    // 북마크 글이면 클래스 on을 추가한다
                    if(result[i].posts.postBookmark == 1) {
                        $('#bookmark-'+result[i].posts.postNo).addClass('on');
                    }
                    if (result[i].commentsList.length > 0) {
                        // 댓글 가져오기
                        for (var j=result[i].commentsList.length-1; j>=0; j--) {
                            $('.post-comment-group[data-id=' + result[i].commentsList[j].postNo + ']').append(`
                                <li class="remark-item" id="cm-`+ result[i].commentsList[j].cmNo + `" remark-srno="` + result[i].commentsList[j].cmNo + `" data-cm-id=` + (j + 1) + ` data-user-id="` + result[i].commentsList[j].cmWriter + `">
                                    <div class="comment-thumbnail js-comment-thumbnail">
                                        <span class="thumbnail size40 radius16" data=""></span>
                                    </div>
                                    <div class="js-remark-view comment-container on ">
                                        <div class="comment-user-area">
                                            <div class="comment-user">
                                                <span class="user-name js-comment-user-name">`+ result[i].commentsList[j].cmName + `</span>
                                                <span class="user-position"></span>
                                                <span class="record-date">`+ result[i].commentsList[j].cmDatetime + `</span>
                                            </div>
                                            <div id="`+ result[i].commentsList[j].cmWriter + `" class="comment-writer-menu">
                                                <button id="cmEditBtn" type="button" class="js-remark-update js-remark-edit-button comment-writer-button on">
                                                    수정</button>
                                                <button id="cmDelBtn" type="button" class="js-remark-delete js-remark-edit-button comment-writer-button on">
                                                    삭제</button>
                                            </div>
                                        </div>
                                        <div class="js-remark-layer comment-content">
                                            <div class="comment-text-area">
                                                <div class="js-remark-text comment-text"><div>`+ result[i].commentsList[j].cmContent + `</div></div>
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
                            `)
                            commentcount++;

                            // 댓글이 3개 이상일시 보이지 않게 숨긴다
                            if ($('#cm-' + result[i].commentsList[j].cmNo + '').attr('data-cm-id') > 2) {
                                $('#cm-' + result[i].commentsList[j].cmNo + '').addClass('d-none');
                            }

                            // 자신이 작성한 댓글이 아니면 수정 삭제를 할 수 없게 수정 삭제 버튼을 없앤다
                            if (result[i].commentsList[j].cmWriter != memNo) {
                                $('#' + result[i].commentsList[j].cmWriter + '').remove();
                            }
                        }

                        // 이전 댓글 더보기 숫자를 설정
                        $('#post-' + result[i].posts.postNo + '').find('#cm-count-id').text(commentcount - 2);

                        // 계시판의 댓글 설정
                        $('#post-' + result[i].posts.postNo + '').attr('data-comment-count', commentcount);
                        
                        // 계시판의 댓글이 2개 이상일경우 댓글 더보기 div를 보여준다
                        if ($('#post-' + result[i].posts.postNo + '').attr('data-comment-count') > 2) {
                            $('#post-' + result[i].posts.postNo + '').find('.comment-more-button').removeClass('d-none');
                        }
                    }
                    
                    // Toast ui viewer 불러오기
                    view(result[i].posts.postNo);
                }
            }
            // count 
            $('#projectPinCount').text(count);
        },
        error: function (xhr, status, err) {
            autoaccess();
        }
    })
}

// 글 하나 가져오기 (중앙 팝업)
export function getPostToCenterPopupAjax(rmNo, postNo){
    $.ajax({
        type:'GET',
        url: 'http://localhost:8080/api/members/'+memNo+'/rooms/'+rmNo+'/posts/'+postNo,
        contentType: 'application/json; charset=utf-8',
        async : false,
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function(result, status, xhr){
            $('#popBack1').append(`
            <li id="post-`+result.posts.postNo+`" class="js-popup-before detail-item back-area" data-read-yn="Y" data-project-srno="`+result.posts.rmNo+`" data-post-srno="`+result.posts.postNo+`" data-remark-srno="" data-bookmark="`+result.posts.postBookmark+`" data-section-srno="" data-rgsr-id="`+result.posts.postWriter+`" mngr-wryn="" mngr-dsnc="" data-post-code="1" data-post-pin="`+result.posts.postPin+`" status="" time="" data-code="VIEW" data-post-url="https://flow.team/l/0fXYO">
                <div id="detailPostCard" class="js-post-nav card-item post-card-wrapper write2">
                    <div class="post-popup-header card-popup-header " style="display: block;">
                        <h3 class="card-popup-title">
                            <i id="projectTitleColor" class="project-color color-code-3"></i>
                            <span class="js-project-title-button">`+result.posts.rmTitle+`</span>
                        </h3>
                        <button class="btn-close card-popup-close close-detail">
                            <i class="icons-close-1"></i>
                        </button>
                    </div>
                    <div class="post-card-header">
                        <div class="post-card-scroll">
                            <div class="card-header-top">
                                <div class="post-author js-post-author" data-author-id="`+result.posts.postWriter+`">
                                    <span class="thumbnail size40 radius16" data=""></span>
                                    <dl class="post-author-info">
                                        <dt>
                                            <strong class="author ellipsis">`+result.posts.postName+`</strong>
                                            <em class="position ellipsis" style="display:inline" data=""></em>
                                            <span class="date">`+result.posts.postDatetime+`</span>
                                            <span class="post-security"> <i class="icons-person-7 js-mouseover" mouseover-text="전체 공개"></i></span>
                                        </dt>
                                    </dl>
                                </div>
                                <div>
                                    <div id = "option-`+result.posts.postNo +`" class="post-option">
                                        <button id="movePost" class="btn-go d-none" style="display: inline-block;">
                                            게시글 바로가기
                                        </button>
                                        <button id="centerpin-`+ result.posts.postNo + `" class="js-pin-post fixed-btn js-pin-authority" data-project-srno="` + rmNo + `" data-post-srno="` + result.posts.postNo + `"  data-post-pin= "` + result.posts.postPin + `" style="display:block" data="">
                                            <!-- fixed-btn on class -->
                                            <span class="blind">상단 고정 등록</span>
                                        </button>
                                        <button id="detailSetting" class="js-setting-button set-btn">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul id="detailSettingList" class="js-setting-ul js-setting-layer setup-group d-none">
                                            <li class="js-setting-item" data-code="modify" style="display:block" data="">
                                                <a id="detailEditBtn" href="#"> <i class="bi bi-card-text"></i>수정
                                                    <i class="edit-auth-icon icons-question js-mouseover d-none" mouseover-text="공동 수정 권한이 활성화 되어있습니다." style="display:none" data=""></i>
                                                </a>
                                            </li>
                                            <li class="js-setting-item" data-code="delete" style="display:block" data="">
                                                <a id="detailDelBtn" href="#"> <i class="bi bi-trash"></i>삭제</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="js-card-header-bottom card-header-bottom ">
                                <div class="post-title-area">
                                    <h4 class="js-post-title post-title ">`+result.posts.postTitle+`</h4>
                                </div>
                            </div>
                            <div class="post-card-container">
                                
                                <div id="originalPost" class="post-card-content " style="display:none" data=""><div>`+result.posts.postContent+`</div></div>
                            
                                <div id="summaryPost" class="post-card-content hidden" style="display:block" data=""><div>`+result.posts.postContent+`</div></div>
                            
                                <div id="summaryFoldArea" class="content-fold" style="display:block" data=""></div>
            
                                <div class="post-bottom-area">
                                    <div class="post-bottom-menu js-reaction-bookmark">
                                        <div class="bottom-button-area">
                                            <button class="js-post-bookmark post-bottom-button" id="bookmark-`+ result.posts.postNo + `" data-pst-id="` + result.posts.postNo + `" data-book-value="0">
                                                <i class="icon-bookmark"></i>
                                                <span>북마크</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="cmt-read-wr">
                                        <div class="comment-count-area">
                                            <span>댓글</span>
                                            <span class="comment-count">`+result.commentsList.length+`</span>
                                        </div>
                                        <div class="js-read-check-button read-confirmation" style="display:block" data="">
                                            <span>읽음</span>
                                            <span class="confirmation-number">1</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- //post-card-container -->
                            </div>
                            <div class="post-card-footer js-comment-area">
                                <div class="comment-header">
                                </div>
                                <ul id="detailComment" class="post-comment-group" data-id=`+result.posts.postNo+`></ul>
                            </div>
                            <div class="js-remark-layer js-edit-layer comment-input-wrap">
                                <div class="comment-thumbnail">
                                    <span class="thumbnail size40 radius16" data=""></span>
                                </div>
                                <form class="js-remark-form comment-container on ">
                                    <fieldset>
                                        <legend class="blind">댓글 입력</legend>
                                        <div class="js-remark-area js-paste-layer comment-input" contenteditable="true" placeholder="줄바꿈 Shift + Enter / 입력 Enter 입니다."></div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            `)

            // 자신의 글이 아니면 상단고정 , 메뉴를 안보이게 한다
            if (result.posts.postWriter != memNo) {
                $('#option-' + result.posts.postNo + '').remove()
            }
           
            // 상단 고정이면 클래스 on을 추가해준다
            if (result.posts.postPin == 1) {
                $('#centerpin-' + result.posts.postNo + '').addClass('on')
            }

            // 북마크 글이면 클래스 on을 추가한다
            if(result.posts.postBookmark == 1) {
                $('#bookmark-'+result.posts.postNo).addClass('on');
            }
            for(let i=0;i<result.commentsList.length;i++){
                $('#detailPostCard #detailComment[data-id='+result.commentsList[i].postNo+']').append(`
                    <li class="remark-item" remark-srno="`+result.commentsList[i].cmNo+`" data-user-id="`+result.commentsList[i].cmWriter+`" ">
                        <div class="comment-thumbnail js-comment-thumbnail">
                            <span class="thumbnail size40 radius16" data=""></span>
                        </div>
                        <div class="js-remark-view comment-container on ">
                            <div class="comment-user-area">
                                <div class="comment-user">
                                    <span class="user-name js-comment-user-name">`+result.commentsList[i].cmName+`</span>
                                    <span class="record-date">`+result.commentsList[i].cmDatetime+`</span>
                                </div>
                                <div id="`+result.commentsList[i].cmWriter+`" class="comment-writer-menu">
                                    <button type="button" class="js-remark-update js-remark-edit-button comment-writer-button on">수정</button>
                                    <button type="button" class="js-remark-delete js-remark-edit-button comment-writer-button on">삭제</button>
                                </div>
                            </div>
                            <div class="js-remark-layer comment-content">
                                <div class="comment-text-area">
                                    <div class="js-remark-text comment-text"><div>`+result.commentsList[i].cmContent+`</div></div>
                                </div>
                            </div>
                        </div>
                        <div class="js-remark-edit comment-container">
                            <div class="js-remark-layer comment-content modify">
                                <form class="js-remark-form comment-text-area">
                                    <fieldset>
                                        <legend class="blind">댓글 입력</legend>
                                        <div class="js-remark-area js-paste-layer comment-input" contenteditable="true" placeholder="줄바꿈 Shift + Enter / 입력 Enter 입니다."></div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </li>
                `)
                // 자신이 작성한 댓글이 아니면 수정 삭제를 할 수 없게 수정 삭제 버튼을 없앤다
                if (result.commentsList[i].cmWriter != memNo) {
                    $('#'+result.commentsList[i].cmWriter+'').remove()
                }
            }

            closeCenterPopup();
        },
        error: function (xhr, status, err) {}
    })
}

// 글 하나 가져오기 (오른쪽 글 카드)
export function getPostToRightPostCardAjax(rmNo, postNo){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/members/'+memNo+'/rooms/'+rmNo+'/posts/'+postNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function(result, status, xhr) {
            $('#popBack1').append(`
                <li id="post-`+result.posts.postNo+`" class="js-popup-before detail-item back-area" data-read-yn="Y" data-project-srno="`+result.posts.rmNo+`" data-post-srno="`+result.posts.postNo+`" data-remark-srno="" data-bookmark="`+result.posts.postBookmark+`" data-section-srno="" data-rgsr-id="`+result.posts.postWriter+`" mngr-wryn="" mngr-dsnc="" data-post-code="1" data-post-pin="`+result.posts.postPin+`" time="" data-code="VIEW" data-post-url="https://flow.team/l/0fj3s">
                    <div id="rightPostCard" class="js-post-nav card-item post-card-wrapper write2 side">
                        <div class="post-popup-header card-popup-header" style="display: block;">
                            <h3 class="card-popup-title">
                                <i id="projectTitleColor" class="project-color color-code-3"></i>
                                <span class="js-project-title-button">`+result.posts.rmTitle+`</span>
                            </h3>
                            <button class="btn-close card-popup-close close-side">
                                <i class="icons-close-1"></i>
                            </button>
                        </div>
                        <div class="post-card-header">
                            <div class="post-card-scroll">
                                <div class="card-header-top">
                                    <div class="post-author js-post-author" data-author-id="`+result.posts.postWriter+`">
                                        <span class="thumbnail size40 radius16" data=""></span>
                                        <dl class="post-author-info">
                                            <dt>
                                                <strong class="author ellipsis">`+result.posts.postName+`</strong>
                                                <em class="position ellipsis" style="display:inline" data=""></em>
                                                <span class="date">`+result.posts.postDatetime+`</span>
                                                <span class="post-security"> <i class="bi bi-people" mouseover-text="전체 공개"></i></span>
                                            </dt>
                                        </dl>
                                    </div>
                                    <div>
                                        <div id = "option-`+result.posts.postNo +`" class="post-option">
                                            <button id="movePost" class="btn-go d-none" style="display: inline-block;">
                                                게시글 바로가기
                                            </button>
                                            <button id="rightpin-`+ result.posts.postNo + `" class="js-pin-post fixed-btn js-pin-authority" data-project-srno="` + rmNo + `" data-post-srno="` + result.posts.postNo + `"  data-post-pin= "` + result.posts.postPin + `" style="display:block" data="">
                                                <!-- fixed-btn on class -->
                                                <span class="blind">상단 고정 등록</span>
                                            </button>
                                            <button id="rightSetting" class="js-setting-button set-btn">
                                                <i class="bi bi-three-dots-vertical"></i>
                                            </button>
                                            <ul id="rightSettingList" class="js-setting-ul js-setting-layer setup-group d-none">
                                                <li class="js-setting-item" data-code="modify" style="display:block" data="">
                                                    <a id="rightEditBtn" href="#"> <i class="bi bi-card-text"></i>수정
                                                        <i class="edit-auth-icon icons-question js-mouseover d-none" mouseover-text="공동 수정 권한이 활성화 되어있습니다." style="display:none" data=""></i>
                                                    </a>
                                                </li>
                                                <li class="js-setting-item" data-code="delete" style="display:block" data="">
                                                    <a id="rightDelBtn" href="#"> <i class="bi bi-trash"></i>삭제</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="js-card-header-bottom card-header-bottom ">
                                    <div class="post-title-area">
                                        <h4 class="js-post-title post-title ">`+result.posts.postTitle+`</h4>
                                    </div>
                                </div>
                                <div class="post-card-container">
                                
                                    <div id="originalPost" class="post-card-content " style="display:block" data=""><div id="viewer" class="viewers`+ result.posts.postNo + `">`+result.posts.postContent+`</div></div>
                                
                                    <div id="summaryPost" class="post-card-content hidden" style="display:none" data=""><div>`+result.posts.postContent+`</div></div>
                                
                                    <button id="postMoreButton" type="button" class="js-contents-more-btn post-more-btn" style="display:none" data="">더보기</button>
                                    <div id="summaryFoldArea" class="content-fold" style="display:none" data=""></div>
                
                                    <div class="post-bottom-area">
                                        <div class="post-bottom-menu js-reaction-bookmark">
                                            <div class="bottom-button-area">
                                                <button class="js-post-bookmark post-bottom-button" id="bookmark-`+ result.posts.postNo + `" data-pst-id="` + result.posts.postNo + `" data-book-value="0">
                                                    <i class="icon-bookmark"></i>
                                                    <span>북마크</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="cmt-read-wr">
                                            <div class="comment-count-area">
                                                <span>댓글</span>
                                                <span class="comment-count">`+result.commentsList.length+`</span>
                                            </div>
                                            <div class="js-read-check-button read-confirmation" style="display:block" data="">
                                                <span>읽음</span>
                                                <span class="confirmation-number">1</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- //post-card-container -->
                                </div>
                                <div class="post-card-footer js-comment-area">
                                    <div class="comment-header">
                                        <button type="button" class="js-remark-prev-button comment-more-button d-none">
                                        이전 댓글 더보기 (<span id="cm-count-id">0</span>)
                                        </button>
                                    </div>
                                    <ul id="rightComment" class="post-comment-group" data-id=`+result.posts.postNo+`></ul>
                                </div>
                                <div class="js-remark-layer js-edit-layer comment-input-wrap">
                                    <div class="comment-thumbnail">
                                        <span class="thumbnail size40 radius16" data=""></span>
                                    </div>
                                    <form class="js-remark-form comment-container on ">
                                        <fieldset>
                                            <legend class="blind">댓글 입력</legend>
                                            <div class="js-remark-area js-paste-layer comment-input" contenteditable="true" placeholder="줄바꿈 Shift + Enter / 입력 Enter 입니다."></div>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `)

            // 자신의 글이 아니면 상단고정 , 메뉴를 안보이게 한다
            if (result.posts.postWriter != memNo) {
                $('#option-' + result.posts.postNo).remove()
            }
           
            // 상단 고정이면 클래스 on을 추가해준다
            if (result.posts.postPin == 1) {
                $('#rightpin-' + result.posts.postNo).addClass('on')
            }

            // 북마크 글이면 클래스 on 추가
            if(result.posts.postBookmark == 1) {
                $('#bookmark-'+result.posts.postNo).addClass('on');
            }
            for(let k=0;k<result.commentsList.length;k++){
                $('#rightPostCard #rightComment[data-id='+result.commentsList[k].postNo+']').append(`
                    <li class="remark-item" remark-srno="`+result.commentsList[k].cmNo+`" data-user-id="`+result.commentsList[k].cmWriter+`">
                        <div class="comment-thumbnail js-comment-thumbnail">
                            <span class="thumbnail size40 radius16" data=""></span>
                        </div>
                        <div class="js-remark-view comment-container on ">
                            <div class="comment-user-area">
                                <div class="comment-user">
                                    <span class="user-name js-comment-user-name">`+result.commentsList[k].cmName+`</span>
                                    <span class="record-date">`+result.commentsList[k].cmDatetime+`</span>
                                </div>
                                <div class="comment-writer-menu">
                                    <button type="button" class="js-remark-update js-remark-edit-button comment-writer-button on">수정</button>
                                    <button type="button" class="js-remark-delete js-remark-edit-button comment-writer-button on">삭제</button>
                                </div>
                            </div>
                            <div class="js-remark-layer comment-content">
                                <div class="comment-text-area">
                                    <div class="js-remark-text comment-text"><div>`+result.commentsList[k].cmContent+`</div></div>
                                </div>
                            </div>
                        </div>
                        <div class="js-remark-edit comment-container">
                            <div class="js-remark-layer comment-content modify">
                                <form class="js-remark-form comment-text-area">
                                    <fieldset>
                                        <legend class="blind">댓글 입력</legend>
                                        <div class="js-remark-area js-paste-layer comment-input" contenteditable="true" placeholder="줄바꿈 Shift + Enter / 입력 Enter 입니다."></div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </li>
                `)
            }

            // Toast ui viewer 불러오기
            view(result.posts.postNo);

            // 오른쪽 글 카드 닫기
            closeRightPostCard();
            // 오른쪽 setting 버튼 닫기
            settingButtonClose();

        },
        error: function (xhr, status, err) {}
    })
}

// 로그인
export function loginAjax(id, pw){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/auth/members',
        data: JSON.stringify({ "memMail": id, "memPw": pw }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            $('.err-id').text('')
            let accessToken = result.accessToken;
            let refreshToken = result.refreshToken;
            let memNo = result.memNo;

            window.localStorage.setItem('accessToken', accessToken);
            window.localStorage.setItem('refreshToken', refreshToken);
            window.localStorage.setItem('memNo', memNo);
            location.href = 'main.html';
        },
        error: function (xhr, status, err) {
            // input, textarea 비우기
            $('#userId').val('');
            $('#memPw').val('');
            // 해당 아이디의 정보가 없다면 에러 메시지 출력
            $('.err-id').text($('#userId').attr('data-login-err-msg'))
            $('.err-pw').text('')
        }
    });
}

// 로그아웃
export function logoutAjax(){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/auth/members/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            window.localStorage.setItem('accessToken', '');
            window.localStorage.setItem('memNo', '-1');
            location.href = 'home.html'
        },
        error: function (xhr, status, err) { 
            autoaccess()
        }
    });
}

// 패스워드 재발급
export function newPasswordAjax(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/auth/email/new',
        data: JSON.stringify({
            memMail: memMail
        }), 
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            $('#loginLayer').removeClass('d-none')
            $('#findPassword').addClass('d-none')
            location.href = 'login.html'
        },
        error: function (xhr, status, err) {
        }
    });
}

// 회원 탈퇴
export function deleteMemberAjax(){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/auth/members/temp/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            alert('성공');
        },
        error: function (xhr, status, err) {
            alert(err);
        }
    });
}

// 프로젝트 리스트 업데이트
export function getAllProjectsByMeAjax(){
    new Promise((succ,fail) => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/members/'+memNo+'/rooms',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function (result, status, xhr) {
                succ(result);

                for(var i=0; i<result.length; i++){
                    // 즐겨찾는 프로젝트
                    if(result[i].favoriteProject==true){
                        $('#MyStarProject').append(`
                            <li class="project-item ui-state-default" data-id="`+result[i].rmNo+`" data-rm-title="`+result[i].rmTitle+`" data-rm-des="`+result[i].rmDes+`">
                                <a class="cursor-pointer">
                                    <!-- 알림 배지 -->
                                    <div class="flow-content-ct project-badge" style="display:none">0</div>
                                    <!-- 좌측 컬러 -->
                                    <div class="color-code left-menu-type-1 color-code-1"></div>
                                    <div class="left-menu-type-con">
                                        <div class="project-star flow-content-star"></div>
                                        <div class="flow-content-txt project-ttl">`+result[i].rmTitle+`</div>
                                        <div class="flow-content-b-c" style="display:block">
                                            <div class="flow-content-hm-txt"><i class="bi bi-person"></i></div>
                                            <span class="member-cnt">`+result[i].rmMemCount+`</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        `);
                    }
                    // 참여중 프로젝트
                    else {
                        $('#MyProject').append(`
                            <li class="project-item ui-state-default" data-id="`+result[i].rmNo+`" data-rm-title="`+result[i].rmTitle+`" data-rm-des="`+result[i].rmDes+`">
                                <a class="cursor-pointer">
                                    <!-- 알림 배지 -->
                                    <div class="flow-content-ct project-badge" style="display:none">0</div>
                                    <!-- 좌측 컬러 -->
                                    <div class="color-code left-menu-type-1 color-code-1"></div>
                                    <div class="left-menu-type-con">
                                        <div class="project-star flow-content-star flow-content-star-un"></div>
                                        <div class="flow-content-txt project-ttl">`+result[i].rmTitle+`</div>
                                        <div class="flow-content-b-c" style="display:block">
                                            <div class="flow-content-hm-txt"><i class="bi bi-person"></i></div>
                                            <span class="member-cnt">`+result[i].rmMemCount+`</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        `);
                    }
                }

                // 즐겨찾기, 참여중 프로젝트 div display 수정
                if($('#MyStarProject').find('li').length!=0)
                    $('#MyStarProject').css('display', 'block');
                else
                    $('#MyStarProject').css('display', 'none');
                if($('#MyProject').find('li').length!=0)
                    $('#MyProject').css('display', 'block');
                else
                    $('#MyProject').css('display', 'none');
            },
            error: function (xhr, status, err) {
                autoaccess()
            }
        });
    }).then((arg)=>{
        // 알림 업데이트
        updateAlarms();
    })
}

// 즐겨찾는 프로젝트로 등록
export function addFavoriteProjectAjax(rmNo){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/favorites',
        data: JSON.stringify({"rmNo": rmNo, "memNo": memNo}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            updateList();
        },
        error: function (xhr, status, err) {   
            autoaccess()
        }
    });
}

// 즐겨찾는 프로젝트 취소
export function deleteFavoriteProjectAjax(rmNo){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/favorites',
        data: JSON.stringify({"rmNo": rmNo, "memNo": memNo}),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            updateList();
        },
        error: function (xhr, status, err) {
            autoaccess()
        }
    });
}

// 이메일 인증코드 전송
export function postEmailCodeAjax(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/auth/email',
        data: JSON.stringify({
            memMail: memMail
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            // 이메일 전송이 완료되면 8자리 코드를 return 받는다
            const ePw = result.ePw
            $('.confirm-button').on('click', function () {           
                let num = $('#authInput').val();

                // 사용자가 입력한 인증 코드와 생성한 인증코드 일치하는지 확인
                if (num == ePw) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8080/api/auth/members/new',
                        data: JSON.stringify({
                            memMail: memMail,
                            memName: memName,
                            memPw: memPw
                        }),
                        contentType: 'application/json; charset=utf-8',
                        success: function (result, status, xhr) {
                            location.href = 'login.html'
                        },
                        error: function (xhr, status, err) {}
                    });
                } else {
                    alert('인증코드가 맞지않습니다')
                    location.href = 'signUp.html'
                }
            })
        },
        error: function (xhr, status, err) {}
    });
}