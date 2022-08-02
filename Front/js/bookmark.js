import {updateRight} from './rightPostCard.js';
import {getBookmarkAjax, addBookmarkAjax} from './ajax.js'

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
    let postNo = $(this).attr('data-pst-id')

    //북마크를 삭제 때 
    if ($(this).hasClass('on')) {
        $(this).removeClass('on')
        removeBookmarkAjax(postNo);
    }
    // 북마크를 추가할 때
    else {
        $(this).addClass('on')
        addBookmarkAjax(postNo);
    }
})