// 글 카드 닫기
const closeCard = function(){
    $('.close-side').click(function(){
        $('#rightComment').children().remove();
        $('#popBack1').find('li').children().remove()
        $('#popBack1').find('li').remove();
    })
}

// setting-button 클릭 시 글 수정, 삭제 보이기
$(document).on('click','#rightSetting',function(e){
    if($('#rightSettingList').hasClass('d-none')){
        $('#rightSettingList').removeClass('d-none');
    } 
    else if(!$('#rightSettingList').hasClass('d-none')){
        $('#rightSettingList').addClass('d-none');
    }
    return false;
})


// Toast ui viewer 
const view1 = function (idx) {
    const viewer = new toastui.Editor.factory({
        el: document.querySelector('.viewers' + idx),
        viewer: true,
        height: '500px',
        hideModeSwitch: true,
        initialEditType: 'wysiwyg'
    });
}

const settingButtonClose = function(){
    $('html').click(function(e) {
        let rightSettingbool = $('#rightSettingList').css('display')=='block';
        // 글 수정, 삭제 버튼 영역 외 display none (setting 버튼 클릭할 시엔 X)
        if(rightSettingbool && !$(e.target).hasClass('.js-setting-ul.js-setting-layer.setup-group')) {
            $(".js-setting-ul.js-setting-layer.setup-group").addClass('d-none');
        }
    });
}

// 오른쪽 글 카드 가져오는 함수
const createRightPost = function(rmNo, postNo){
    console.log(rmNo, postNo)
    let accessToken= window.localStorage.getItem('accessToken');
    let memNo= window.localStorage.getItem('memNo');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts/'+postNo,
        contentType: 'application/json; charset=utf-8',
        // async: false,
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function(result, status, xhr) {
            $('#popBack1').append(`
                <li id="post-`+result.posts.postNo+`" class="js-popup-before detail-item back-area" data-read-yn="Y" data-project-srno="`+result.posts.rmNo+`" data-post-srno="`+result.posts.postNo+`" data-remark-srno="-1" data-section-srno="" data-rgsr-id="`+result.posts.postWriter+`" mngr-wryn="" mngr-dsnc="" data-post-code="1" pin-yn="Y" time="" data-code="VIEW" data-post-url="https://flow.team/l/0fj3s">
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
                                                <span class="post-security"> <i class="icons-person-7 js-mouseover" mouseover-text="전체 공개"></i></span>
                                            </dt>
                                        </dl>
                                    </div>
                                    <div>
                                        <div class="post-option">
                                            <button id="movePost" class="btn-go d-none" style="display: inline-block;">
                                                게시글 바로가기
                                            </button>
                                            <button id="pinToTopBnt" class="js-pin-post fixed-btn js-pin-authority" style="display:block" data="">
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
                                                <button class="js-post-bookmark post-bottom-button ">
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
                                        <button type="button" class="js-remark-prev-button comment-more-button ">
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
            view1(result.posts.postNo);

            // 글 카드 닫기
            closeCard();
            
            settingButtonClose();

        },
        error: function (xhr, status, err) {}
    })
}

// 오른쪽 글 카드 초기화 및 업데이트 함수
const clearAndUpdateRight = function(rmNo, postNo) {
    $('#rightComment').children().remove();
    $('#popBack1').find('li').children().remove()
    $('#popBack1').find('li').remove();

    // 오른쪽 글 카드 업데이트
    createRightPost(rmNo, postNo);
}

export default function updateRight(rmNo, postNo) {
    
    // 오른쪽 글 카드 초기화 및 업데이트
    return clearAndUpdateRight(rmNo, postNo);
}