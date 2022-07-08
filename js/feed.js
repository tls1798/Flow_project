$(function () {
    // 미확인 스크립트
    $('#unchecked-test').click(function () {
        $('#posts-ul-unchecked').prepend(`<li style="margin-left: 15px; padding-bottom: 10px; ">
                            <div style="float:left">
                                <img class="feedProfile" src="../imgs/defaultprofile.png">
                            </div>
                            <div>
                                <strong>정창환</strong>
                                <span class="date">1시간 전</span>
                                <button
                                    style="float:right;margin-right:15px; border:1px solid #ff6b6b; margin-right: 10px;color: #ff6b6b; background-color: white;border-radius: 4px; width: 40px;padding: 3px; margin-right: 15px;">보기</button>
                            </div>
                            <span>내용</span>
                        </li>`)
    })

    $('#read-allposts').click(function () {
        $('#posts-unchecked').hide()
    })

    // 스크립트 dropdown
    $('.dropdown-hide').hide();

    $('.dropdown-more').click(function () {
        $('.dropdown-hide').show()
    })
    $('.post-card-wrapper-side').hide();
    //  옆에 글보기
    $('.unchecked-button').click(function () {
        $('.post-card-wrapper-side').show();
    })
    $('.close-popup').click(function () {
        $('.post-card-wrapper-side').hide();
    })

    // 댓글 script
    // 더보기 script
    $('.post-comment-more').prepend("<button class=\"clicked-more\">이전 댓글 더보기 (1)</button>");
    // 더보기 클릭시 
    $('.clicked-more').click(function () {
        $('.post-comment-more')
            .prepend(`<li class="post-comment-more-margin before-comment">
                        <div>
                        <!-- <div class="post-comment post-comment-update">
                            <img class="feedProfile" src="../imgs/defaultprofile.png">
                            <form>
                                <input class="post-comment-input" type="text" onkeypress="JavaScript:press(this.form)" placeholder="줄바꿈은 Shift + Enter / 입력 Enter 입니다">
                            </form>
                        </div> -->
                            <div>
                                <div style="float:left">
                                    <img class="feedProfile" src="../imgs/defaultprofile.png">
                                </div>
                                <div>
                                    <strong>정창환</strong>
                                        <span class="date">2022-07-04 10:03</span>
                                            <button class="txt-like like-hover">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                                                </svg> 좋아요
                                            </button>
                                            <span class="txt-like"style="float:right">
                                                <button class="like-hover post-comment-update-clicked " style="margin-left: 5px">수정</button>
                                                <button class="like-hover comment-delete" style="margin-left: 5px">삭제</button>
                                            </span>
                                        </div>
                                        <div class="post-comment-margin" style="display:block">내용</div>
                                    </div>
                                </div>
                        </li>`);
        $('.clicked-more').hide();
    })
    // 수정
    // $('.post-comment-update').hide()
    $('.post-comment-update').css('display', 'none');
    $('.post-comment-update-clicked').click(function () {
        $('.before-comment').hide();
        $('.post-comment-update').show();
    });
    // 삭제
    $('.comment-delete').click(function () {
        $('.before-comment').hide();
    });
    // 어디서 enter 입력?
    // 댓글 enter시 입력 JS
    function press(f) {
        if (f.keyCode == 13) { //javascript에서는 13이 enter키를 의미함
            formname.submit(); //formname에 사용자가 지정한 form의 name입력
        }
    }
    // 초대하기 버튼 클릭 이벤트
    $('#openInviteLayerBtn').click(function (e) {
        e.preventDefault();
        $('#staticBackdrop').modal("show")
    })
    $('#invited-check').click(function (e) {
        e.preventDefault();
        $('#staticBackdrop').modal("hide")
        console.log('a')
        $('#myFullsizeModal').modal("show")
    })
    // 초대 리스트 모달 스크립트

    $('.selected-show').hide();
    $('.checked-btn').click(function () {
        $('.clicked-right').addClass('clicked-right-scroll')
            .prepend(`<li class="checked-btn">
                    <div style="height:50px;">
                        <a href="#" style="text-decoration: none;color: black;">
                            <img class="detail-popup-icon-2" src="../imgs/defaultprofile.png"
                                style="border-radius: 16px;margin-right: 5px;">
                            <strong
                                style="font-size: 13px;color:#555555;font-weight:700px;margin-top:15px; line-height:15px;">정창환</strong>
                        </a>
                    </div>
                </li>`);
        $('.clicked-right').show();
        $('.plz-seclect-hide').hide();
        $('.selected-show').show();
    })

    function clickedhandler(e) {
        if (e.target.classList.value === 'checked-btn-background') {
            console.log(e.target.classList.value)
            $('#checked-div').removeClass('checked-btn-background')
        }
        else
            $('#checked-div').
                addClass('checked-btn-background')
    }
    $('#checked-div').click(function (e) {
        console.log(e.target.classList.value)
        clickedhandler(e)
    });

    $('.alldelete').click(function () {
        $('.plz-seclect-hide').show();
        $('.selected-show').hide();
        $('.clicked-right').hide();
    });

})


