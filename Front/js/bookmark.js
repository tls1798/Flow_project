import {autoaccess} from './autoAccess.js'
import updateRight from '../js/rightPostCard.js';

// 내 북마크 조회
const bookmarkList = function () {
    
    // 북마크 화면 초기화
    $('#myPostContentUl').text('')
    let accessToken = window.localStorage.getItem('accessToken')
    let memNo = window.localStorage.getItem('memNo')
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

// 북마크 메뉴 클릭 시 북마크 리스트 화면
$('.left-menu-bookmark').on('click', function (e) {
    bookmarkList();
})

// 북마크 리스트 화면에서 글 클릭 시 오른쪽 글 카드 화면 띄움
$(document).on('click', '.booklist', function () {
    let rmNo = $(this).attr('data-project-id')
    let postNo = $(this).attr('data-post-id')
    updateRight(rmNo, postNo)
})

// 북마크 누를시
$(document).on('click', '.js-post-bookmark', function () {
    let accessToken = window.localStorage.getItem('accessToken')
    let memNo = window.localStorage.getItem('memNo')
    let postNo = $(this).attr('data-pst-id')

    //북마크를 삭제 때 
    if ($(this).hasClass('on')) {
        $(this).removeClass('on')
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
    // 북마크를 추가할 때
    else {
        $(this).addClass('on')
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
})

// 북마크 적용 알림창
const alert = function () {
    $('.alert-bookmark').css('display', 'block')

    setTimeout(function () {
        $('.alert-bookmark').fadeOut(500, "swing");
    }, 2000);
    return;
}