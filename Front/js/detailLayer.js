$(function(){


    // 참여자 영역 이동
    $(document).scroll(function(){
       $('#projectParticipants').css('transform', 'translateX(' + (0 - $(document).scrollLeft()) + 'px');
    });

    // 글 수정 삭제 창 display:none -> false, block -> true
    var postSettingBool = false;

    // 글 수정 삭제 디테일 버튼 클릭 시
    $("#postSetting").click(function(){
        if(!postSettingBool){
            $(".js-setting-layer").css('display', 'block');
            postSettingBool=!postSettingBool;
            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    });

    // 프로젝트 디테일 창 클릭할 시엔 display none X
    $('.js-setting-layer').click(function(){
        return false;
    });

    $('html').click(function() {
        // 프로젝트 디테일 창 display none
        if(postSettingBool) {
            $(".js-setting-layer").css('display', 'none');
            postSettingBool=!postSettingBool;
        }
    });

    // 글 고정
    $('.fixed-btn').click(function(e){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
        } else{
            $(this).addClass('on');
        }
    })


    // 참여자 리스트 업데이트 함수
    const updateParticipant = function(rmNo){
        let accessToken= window.localStorage.getItem('accessToken');
        let memNo= window.localStorage.getItem('memNo');
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/rooms/'+rmNo+'/members',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function (result, status, xhr) {

                // 초기화
                $('#participantsUl').find('li').remove();

                // 총 참여자 수 수정
                $('#participantCount').text(result.length);
                // 관리자 제외 참여자 수 수정
                $('#outerParticipantsCount').text(result.length-1);

                // 프로젝트 관리자
                $('.participants-admin-span').append(`
                    <li class="js-participant-item" data-id="`+result[0].rmAdmin+`">
                        <div class="post-author">
                            <span class="js-participant-profile thumbnail size40 radius16" data=""></span>
                            <dl class="post-author-info">
                                <dt>
                                    <strong class="js-participant-name author ellipsis">`+result[0].adminName+`</strong>
                                    <em class="position ellipsis" style="display:none" data=""></em>
                                </dt>
                            </dl>
                        </div>
                    </li>
                `);

                // 참여자
                for(var i=0; i<result.length; i++){
                    // 관리자면 참여자에 추가하지 않음
                    if(result[i].memNo==result[i].rmAdmin) continue;

                    $('.participants-member-span').append(`
                        <li class="js-participant-item" data-id="`+result[i].memNo+`" >
                            <div class="post-author">
                                <span class="js-participant-profile thumbnail size40 radius16" data=""></span>
                                <dl class="post-author-info">
                                    <dt>
                                        <strong class="js-participant-name author ellipsis">`+result[i].memName+`</strong>
                                        <em class="position ellipsis" style="display:none" data=""></em>
                                    </dt>
                                </dl>
                            </div>
                        </li>
                    `);
                }

                // 관리자만 존재하고 참여자는 0명일 경우 span display:none
                if(result.length==1)
                    $('.participants-member-span').css('display', 'none');
                else
                    $('.participants-member-span').css('display', 'block');
            },
            error: function (xhr, status, err) {    
            }
        });
    }

    // 프로젝트 선택
    $(document).on('click', '.project-item', function(e){

        // 참여자 리스트 업데이트
        updateParticipant($(this).attr('data-id'));

        // 글, 댓글 가져오기
        getPostAll($(this).attr('data-id'));
    })
    


    // 프로젝트 선택 시 해당 프로젝트에 있는 글 조회
    const getPostAll = function(rmNo){
        let accessToken= window.localStorage.getItem('accessToken');
        let memNo= window.localStorage.getItem('memNo');
        // getPosts
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function(result, status, xhr){

                // 초기화
                $('#detailUl').find('li').remove();
                $('#detailUl').find('div').remove();

                // TopSettingBar에 프로젝트 번호 넣기
                $('#detailSettingProjectSrno').text(rmNo);
                
                // 게시글 없을 때
                if(result.length == 0){
                    $('#detailUl').append(`
                        <div id="noDetailData" class="detail-data-none">
                            <img src="https://flow.team/flow-renewal/assets/images/none_member.png" alt="함께할 멤버들을 지금 초대해 보세요!"/>
                            <p class="none-text">아직 참여중인 멤버들이 없습니다<br>
                                함께할 멤버들을 지금 초대해 보세요!</p>
                            <button id="noDetailDataBnt" type="button" class="data-none-button invite">초대하기</button>
                        </div>
                    `);
                } else{

                    // 게시글 있을 때
                    for(var i=0;i<result.length;i++){
                        $('#detailUl').append(`
                            <li id="post-`+result[i].posts.postNo+`" class="js-popup-before detail-item back-area" data-read-yn="Y" data-project-srno="`+rmNo+`" data-post-srno="`+result[i].posts.postNo+`" data-remark-srno="" data-section-srno="" data-rgsr-id="`+memNo+`" mngr-wryn="" mngr-dsnc="" data-post-code="1" pin-yn="N" time="" data-code="VIEW" data-post-url="https://flow.team/l/04vvh"">
                                <div class="js-post-nav card-item post-card-wrapper write2 ">
                                    <div class="post-card-header">
                                        <div class="post-card-scroll">
                                            <div class="card-header-top">
                                                <div class="post-author js-post-author" data-author-id="`+result[i].posts.postName+`">
                                                    <span class="thumbnail size40 radius16" data=""></span>
                                                    <dl class="post-author-info">
                                                        <dt>
                                                            <strong class="author ellipsis">`+result[i].posts.postName+`</strong>
                                                            <em class="position ellipsis" style="display:inline" data=""></em>
                                                            <span class="date">`+result[i].posts.postDatetime+`</span>
                                                            <span class="post-security"> <i class="bi bi-people" mouseover-text="전체 공개"></i></span>
                                                        </dt>
                                                    </dl>
                                                </div>
                                                <div>
                                                    <div class="post-option">
                                                        <button id="movePost" class="btn-go" style="display: none;">
                                                            게시글 바로가기
                                                        </button>
                                                        <button id="pinToTopBnt" class="js-pin-post fixed-btn js-pin-authority " style="display:block" data="">
                                                            <!-- fixed-btn on class -->
                                                            <span class="blind">상단 고정 등록</span>
                                                        </button>
                                                        <button id="postSetting" class="js-setting-button set-btn">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="js-setting-ul js-setting-layer setup-group d-none">
                                                            <li class="js-setting-item" data-code="modify" style="display:block" data="">
                                                                <a id="postEditBtn" href="#"><i class="bi bi-card-text"></i>수정</a>
                                                            </li>
                                                            <li class="js-setting-item" data-code="delete" style="display:block" data="">
                                                                <a id="postDelBtn" href="#"> <i class="bi bi-trash"></i>삭제</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="js-card-header-bottom card-header-bottom ">
                                                <div class="post-title-area">
                                                    <h4 class="js-post-title post-title ">`+result[i].posts.postTitle+`</h4>
                                                </div>
                                            </div>
                                            <div class="post-card-container">
                                                <div id="originalPost" class="post-card-content " style="display:block" data=""><div>`+result[i].posts.postContent+`</div></div>
                                                <div id="summaryPost" class="post-card-content hidden" style="display:none" data=""><div>`+result[i].posts.postContent+`</div></div>
                                                <button id="postMoreButton" type="button" class="js-contents-more-btn post-more-btn" style="display:none" data="">더보기</button>
                                                <div id="summaryFoldArea" class="content-fold" style="display:none" data=""></div>
                                                <div class="post-bottom-area">
                                                    <div class="post-bottom-menu js-reaction-bookmark">
                                                        <div class="bottom-button-area">
                                                            <button class="js-post-reaction post-bottom-button ">
                                                                <i class="icon-reaction"></i>
                                                                <span>좋아요</span>
                                                            </button>
                                                            <button class="js-post-bookmark post-bottom-button ">
                                                                <i class="icon-bookmark"></i>
                                                                <span>북마크</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="cmt-read-wr">
                                                        <div class="comment-count-area">
                                                            <span>댓글</span>
                                                            <span class="comment-count">0</span>
                                                        </div>
                                                        <div class="js-read-check-button read-confirmation" style="display:block" data="">
                                                            <span>읽음</span>
                                                            <span class="confirmation-number">1</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="post-card-footer js-comment-area">
                                                <div class="comment-header">
                                                    <button type="button" class="js-remark-prev-button comment-more-button ">
                                                        이전 댓글 더보기 (0)
                                                    </button>
                                                </div>
                                                <ul class="post-comment-group" data-id=`+result[i].posts.postNo+`></ul>
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

                        if(result[i].commentsList.length>0){

                            // 댓글 가져오기
                            for(var j=0;j<result[i].commentsList.length;j++){ 
                                $('.post-comment-group[data-id='+result[i].commentsList[j].postNo+']').append(`
                                    <li class="remark-item" remark-srno="`+result[i].commentsList[j].cmNo+`" data-user-id="`+result[i].commentsList[j].cmWriter+`">
                                        <div class="comment-thumbnail js-comment-thumbnail">
                                            <span class="thumbnail size40 radius16" data=""></span>
                                        </div>
                                        <div class="js-remark-view comment-container on ">
                                            <div class="comment-user-area">
                                                <div class="comment-user">
                                                    <span class="user-name js-comment-user-name">`+result[i].commentsList[j].cmName+`</span>
                                                    <span class="user-position"></span>
                                                    <span class="record-date">"`+result[i].commentsList[j].cmDatetime+`"</span>
                                                    <div class="js-remark-like comment-like ">
                                                        <span class="js-remark-like-button"><em class="txt-like">좋아요</em></span>
                                                        <span class="js-remark-like-count comment-like-count ">0</span>
                                                    </div>
                                                </div>
                                                <div class="comment-writer-menu">
                                                    <button id="cmEditBtn" type="button" class="js-remark-update js-remark-edit-button comment-writer-button on">
                                                        수정</button>
                                                    <button id="cmDelBtn" type="button" class="js-remark-delete js-remark-edit-button comment-writer-button on">
                                                        삭제</button>
                                                </div>
                                            </div>
                                            <div class="js-remark-layer comment-content">
                                                <div class="comment-text-area">
                                                    <div class="js-remark-text comment-text"><div>`+result[i].commentsList[j].cmContent+`</div></div>
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
                                            <div class="comment-like-area d-none">
                                                <div class="js-remark-like comment-like ">
                                                    <span class="js-remark-like-button"><em class="txt-like">좋아요</em></span>
                                                    <span class="js-remark-like-count comment-like-count ">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                `)
                            }
                        }
                    }
                }
            },
            error: function(xhr, status, err){
            }
        })
    }

    // 글 디테일 창 
    var postDetailBool = false;

    // 글 디테일 버튼 클릭 시
    $(document).on('click','#postSetting',function(){
        if(!postDetailBool){
            $(this).next().removeClass('d-none');
            postDetailBool=!postDetailBool;
        }
        return false;
    })
    
    // 아무 곳 클릭 시 글 디테일 버튼 사라지게 
    $('html').click(function(){
        if(postDetailBool){
            $('[id=postSetting]').next().addClass('d-none');
            postDetailBool=!postDetailBool;
        }
    })
});