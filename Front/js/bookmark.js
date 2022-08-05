import {updateRight} from './rightPostCard.js';
import {getBookmarkAjax, addBookmarkAjax,removeBookmarkAjax} from './ajax.js'

// 내 북마크 조회
export function bookmarkList(){
    // 북마크 화면 초기화
    $('#myPostContentUl').text('');
    getBookmarkAjax();
}

// 북마크 적용 알림창
export function alert(){
    $('.alert-bookmark').css('display', 'block')

    setTimeout(function () {
        $('.alert-bookmark').fadeOut(500, "swing");
    }, 2000);
    return;
}

// 북마크 리스트 화면에서 글 클릭 시 오른쪽 글 카드 화면 띄움
$(document).on('click', '.booklist', function () {
    let rmNo = $(this).attr('data-project-id')
    let postNo = $(this).attr('data-post-id')
    updateRight(rmNo, postNo, -1)
})

// 북마크 아이콘 누를시
$(document).on('click', '.js-post-bookmark', function () {
    let postNo = $(this).attr('data-pst-id')

    // 북마크 해제
    if ($(this).hasClass('on')) {
        $(this).removeClass('on')
        removeBookmarkAjax(postNo);
    }
    // 북마크 추가
    else {
        $(this).addClass('on')
        addBookmarkAjax(postNo);
    }
})