// 중앙 팝업 닫기
const closeCard = function(){
    $('.close-detail').click(function(){
        $('#detailComment').children().remove();
        $('#popBack1>li').remove();
        $('#postPopup').removeClass('flow-all-background-1');
    })
}

// 중앙 팝업 영역 외 클릭 시 닫기
$('#popBack1').click(function(e){
    if(!$(e.target).closest('#rightPostCard').length>0&&!$(e.target).closest('#detailPostCard').length>0){
        $('#detailComment').children().remove();
        $('#popBack1>li').remove();
        $('#postPopup').removeClass('flow-all-background-1');
    }

})

const createPopup = function(ntNo, typeNo, rmNo, postNo){
    let accessToken= window.localStorage.getItem('accessToken');
    let memNo= window.localStorage.getItem('memNo');
    
    if(typeNo==3){
        $('.project-item[data-id='+rmNo+']').click();
        $('#postPopup').removeClass('flow-all-background-1');
    } else{
        $.ajax({
            type:'GET',
            url: 'http://localhost:8080/api/rooms/'+rmNo+'/posts/'+postNo,
            contentType: 'application/json; charset=utf-8',
            async : false,
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function(result, status, xhr){
                $('#popBack1').append(`
                <li id="post-`+result.posts.postNo+`" class="js-popup-before detail-item back-area" data-read-yn="Y" data-project-srno="`+result.posts.rmNo+`" data-post-srno="`+result.posts.postNo+`" data-remark-srno="36233808" data-section-srno="" data-rgsr-id="`+result.posts.postWriter+`" mngr-wryn="" mngr-dsnc="" data-post-code="1" pin-yn="N" status="" time="" data-code="VIEW" data-post-url="https://flow.team/l/0fXYO">
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
                                            <button id="centerpin-`+ result.posts.postNo + `" data-post-srno="`+result.posts.postNo+`" class="js-pin-post fixed-btn js-pin-authority " data-post-pin= "` + result.posts.postPin + `" style="display:block" data="">
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
                    $('#option-'+result.posts.postNo+'').remove()
                }
                // 상단 고정이면 클래스 on을 추가해준다
                if (result.posts.postPin == 1) {
                    $('#centerpin-' + result.posts.postNo + '').addClass('on')
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
                    if (result.commentsList[i].cmWriter != window.localStorage.getItem('memNo')) {
                        $('#'+result.commentsList[i].cmWriter+'').remove()
                    }
                }

                closeCard();
            },
            error: function (xhr, status, err) {}
        })
    }
}

// detailPopup 초기화 및 업데이트 함수
const clearAndUpdatePopup = function(ntNo, typeNo, rmNo, postNo) {
    // 초기화
    $('#detailComment').children().remove();
    $('#popBack1>li').children().remove();
    $('#popBack1>li').remove();
    $('#postPopup').addClass('flow-all-background-1');
    // detailPopup 업데이트
    createPopup(ntNo, typeNo, rmNo, postNo);
}

export default function updatePopup(ntNo, typeNo, rmNo, postNo) {
    // detailPopup 초기화 및 업데이트
    return clearAndUpdatePopup(ntNo, typeNo, rmNo, postNo);
}