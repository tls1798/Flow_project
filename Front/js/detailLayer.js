import {autoaccess} from './autoAccess.js'
import readAlarm from './alarmLayer.js'
import updateAlarms from './socket.js'
import updateRight from '../js/rightPostCard.js';

// $(function () {
    // 참여자 영역 이동
    $(document).scroll(function () {
        $('#projectParticipants').css('transform', 'translateX(' + (0 - $(document).scrollLeft()) + 'px');
    });

    // 글 고정
    $('.fixed-btn').click(function (e) {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
        } else {
            $(this).addClass('on');
        }
    })

    // 참여자 리스트 업데이트 함수
    const updateParticipant = function (rmNo) {
        let accessToken = window.localStorage.getItem('accessToken')
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
    var getpinPosts;
    // 프로젝트 선택
    $(document).on('click', '.project-item', function (e) {

        // 참여자 리스트 업데이트
        updateParticipant($(this).attr('data-id'));

        // TopSettingBar, inviteTitle 업데이트
        updateTopSettingBar($(this).attr('data-id'), $(this).attr('data-rm-title'), $(this).attr('data-rm-des'));

        // 글, 댓글 가져오기
        getPostAll($(this).attr('data-id'));

        // 상단고정에서 사용할 변수에 값 담기
        getpinPosts = $(this).attr('data-id');

        // 알림 레이어에서 미확인 알림 가져오기
        updateUnreadAlarmFunc($(this).attr('data-id'));

         // 프로젝트 내부 즐겨찾기
        if ($(this).find('.project-star').hasClass('flow-content-star-un')) {
            $('#projectStar').addClass('unstar')
        } else {
            $('#projectStar').removeClass('unstar')
        }
    })

    // 알림레이어 변경될 시 프로젝트 알림 배지 업데이트
    $('#alarmTopCount').change(function () {
        updateUnreadAlarmFunc($('#detailSettingProjectSrno').text());

        $('.project-item').each(function (idx, item) {
            let rmNo = $(item).attr('data-id');
            
            // 초기화
            $('.project-item[data-id=' + rmNo + ']').find('.project-badge').css('display', 'none');
            $('.project-item[data-id=' + rmNo + ']').find('.project-badge').text(0);

            let cnt = $('#alarmUl li.on[data-project-no=' + rmNo + ']').length
            if (cnt > 0) {
                $('.project-item[data-id=' + rmNo + ']').find('.project-badge').css('display', 'block');
                $('.project-item[data-id=' + rmNo + ']').find('.project-badge').text(cnt);
            }
        })
    })

    // 미확인 알림 더보기 클릭
    $('#notReadAlarmMore').click(function () {
        var cnt = 10;

        $('.not-read-alarm-item').each(function (idx, item) {
            if ($(item).css('display') == 'table') return true;
            if (cnt == 10) $('.not-read-alarm-item:eq(' + (idx - 1) + ')').css('padding', '10px 20px 10px 20px');
            if (--cnt >= 0) $(item).css('display', 'table');
            if (cnt == 0) $('.not-read-alarm-item:eq(' + idx + ')').css('padding', '10px 20px 20px 20px');
        })
        
        if ($('#notReadAlarmUl .not-read-alarm-item:hidden').length == 0)
            $('#notReadAlarmMore').css('display', 'none');
    })

    // 미확인 모두 읽기
    $('#readAllPostBnt').click(function () {
        let accessToken = window.localStorage.getItem('accessToken')
        let memNo = window.localStorage.getItem('memNo')

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
    })

    // 미확인 알림 읽기
    $(document).on('click', '.not-read-alarm-item', function (e) {
        let rmNo = $(this).attr('data-project-no');
        let postNo = $(this).attr('data-post-no');

        updateRight(rmNo, postNo);
        readAlarm($(this).attr('data-notis-no'), postNo);
    })

    // TopSettingBar, inviteTitle 업데이트 함수
    const updateTopSettingBar = function (rmNo, rmTitle, rmDes) {
        $('#detailSettingProjectSrno').text(rmNo);
        $('#projectTitle').text(rmTitle);
        $('#projectContents').text(rmDes);
        $('#inviteTitle').text(rmTitle);
    }
    
    // Toast ui viewer 
    const view = function (idx) {
        const viewer = new toastui.Editor.factory({
            el: document.querySelector('.viewer' + idx),
            viewer: true,
            height: '500px',
            hideModeSwitch: true,
            initialEditType: 'wysiwyg'
        });
    }

    // 프로젝트 선택 시 해당 프로젝트에 있는 글 조회
    const getPostAll = function (rmNo) {
       $('#rightComment').children().remove()
        let accessToken = window.localStorage.getItem('accessToken')
        let memNo = window.localStorage.getItem('memNo')
    
        // getPosts
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
    // 이전 댓글 더보기 클릭할시
    $(document).on('click', '.comment-more-button', function () {
        // 남은 댓글의 수
        let cmcnt = $('#cm-count-id').text()
        let cnt = 10;
        
        $($(this).closest('.post-card-footer.js-comment-area').find('.remark-item').get().reverse()).each(function (idx, item) {
            // 처음 보여주는 댓글 2개를 빼고 시작하기 위함
            if ($(this).hasClass('d-none')) {
                if (--cnt >= 0) {
                    $(item).removeClass('d-none');
                    cmcnt--;
                }
            }
        })
        // 남은 댓글이 없을시 버튼을 삭제하기 위함
        if (cmcnt == 0)
            $(this).addClass('d-none')

        $('#cm-count-id').text(cmcnt);
    })

    // 상단 고정 누를시
    $(document).on('click', '.js-pin-post', function (e) {

        // 제출 누르면 저 클래스가 사라져서 임의로 추가해져서 팝업창을 계속 띄우게 유지함
        $('#popupBackground').addClass('flow-all-background-1');

        let accessToken = window.localStorage.getItem('accessToken')
        let postNo = ($(this).attr('data-post-srno'))
        let postPin = ($(this).attr('data-post-pin'))
        // 현재 버튼 id를 담아준다
        let pinid = ($(this).attr('id'))
        var bool = 0;
        if ($(this).attr('data-post-pin') == 0)
            $(this).attr('data-post-pin', 1)
        else
            $(this).attr('data-post-pin', 0)
        // 포스트핀이 0이면 포스트핀 1로 바꾸고 on이 있으면 on을 없애고 없으면 on을 만든다
        postPin == 0 ? postPin = 1 : postPin = 0
        // if (postPin == 1)
        //     $('.popup-cont').text('상단고정 하시겠습니까');
        // else if (postPin == 0)
        //     $('.popup-cont').text('이 글을 상단고정 해제 하시겠습니까');
        // // 팝업창을 띄운다
        // $('.flow-project-popup-6').removeClass('d-none'), $('#popupBackground').removeClass('d-none')
        // // 확인을 누르면 상단고정 또는 해제를 한다
        
        // $('.submit-event').on('click', function (e) {
        //     if ($('.popup-cont').text() == '상단고정 하시겠습니까' || $('.popup-cont').text() == '이 글을 상단고정 해제 하시겠습니까') {
        //         // $('#' + pinid).hasClass('on') ? $('#' + pinid).removeClass('on') : $('#'+pinid).addClass('on')
        
  
                if ($('#' + pinid).hasClass('on')) {
                    $('#' + pinid).removeClass('on')
                }
                else
                    $('#' + pinid).addClass('on')
        async function a() {
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
        }

                // popupclose()
            // }
// })
        // 취소 시키기
        $('.flow-pop-sub-button-1').on('click', function () {
            popupclose();
        })

        // 아무데나 눌러도 팝업 사라지게 하기
        $('#popBack2').on('click', function () {
            popupclose();
        })
        a().then()
    })

    // 상단고정 팝업 종료 함수
    const popupclose = function () {
        $('.flow-project-popup-6').addClass('d-none');
        $('#popupBackground').addClass('d-none');
    }

    // 글 디테일 버튼 클릭 시
    $(document).on('click', '#postSetting', function (e) {
        let postDetailBool = $(this).next().hasClass('d-none');
            if (postDetailBool) {
                $(this).next().removeClass('d-none');
            } else {
                $(this).next().addClass('d-none');
            }
        return false;
    })
        
    // 아무 곳 클릭 시 글 디테일 버튼 사라지게 
    $('html').click(function(){
        if($('.js-setting-ul.js-setting-layer.setup-group').hasClass('d-none')){
            $('.js-setting-ul').addClass('d-none');
        }
    })

    // 알림 레이어에서 미확인 알림 가져오는 함수
    const updateUnreadAlarmFunc = function (rmNo) {

        // 초기화
        $('#projectAlarmArea').css('display', 'none');
        $('#notReadAlarmUl li').remove();
        $('#projectNotReadCount').text(0);

        let cnt = 0;

        // 현재 프로젝트의 미확인알림 갯수
        $('#alarmUl li.on').each(function (idx, item) {
            let alarmRmNo = $(item).attr('data-project-no');
            let ntNo = $(item).attr('data-notis-no');
            let ntTypeNo = $(item).attr('data-type-no');
            let ntDetailNo = $(item).attr('data-detail-no');
            let postNo = $(item).attr('data-post-no');
            let des = $(item).find('.alarm-tit-ellipsis').text();
            let content = $(item).find('.alarm-cont').text();
            let elTime = $(item).find('.alarm-datetime').text();
            let displayStyle = cnt >= 3 ? 'style="display:none"' : 'style="display:table"';
        
            // 현재 프로젝트와 일치하지 않으며, 추가된 미확인 알림이 하나도 없을 경우
            if (alarmRmNo !== rmNo || ntTypeNo == 3) {
                if ($('#notReadAlarmUl li').length == 0)
                    $('#projectAlarmArea').css('display', 'none');

                return true;
            }
        
            $('#projectAlarmArea').css('display', 'block');
            $('#projectNotReadCount').text(++cnt);
            $('#notReadAlarmUl').append(`
            <li class="not-read-alarm-item" data-project-no=`+ alarmRmNo + ` data-notis-no=` + ntNo + ` data-type-no=` + ntTypeNo + ` data-detail-no=` + ntDetailNo + ` data-post-no=` + postNo + ` ` + displayStyle + `>
                <div class="unidentified-item profile">
                    <span class="thumbnail size40 radius16" style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)" data=""></span>
                </div>
                <div class="middle-wr">
                    <div class="unidentified-item title">
                        <em class="unidentified-name"><i class=""></i>`+ des + `</em>
                        <span class="unidentified-time">`+ elTime + `</span>
                    </div>
                    <div class="unidentified-item task">
                        <div class="unidentified-task-content">
                            <span style="display:block" data="">`+ content + `</span>
                        </div>
                    </div>
                </div>
                <div class="unidentified-item button">
                    <button type="button" class="unidentified-detail-btn">
                        보기
                    </button>
                </div>
            </li>
        `);
        });

        if (cnt > 3) {
            $('#notReadAlarmMore').css('display', 'block');
            $('.not-read-alarm-item:eq(2)').css('padding', '10px 20px 20px 20px');
        }
    }
    
// })