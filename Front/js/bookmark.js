import {updateRight} from './rightPostCard.js';
import {getBookmarkAjax, addBookmarkAjax,removeBookmarkAjax} from './ajax.js'

// 내 북마크 조회
export function bookmarkList(){
    // title 변경
    $(document).prop('title', '플로우(flow) - 대한민국 No.1 올인원 협업툴');

    // 북마크 화면 초기화
    $('#myPostContentUl').text('');
    getBookmarkAjax();
}

// 북마크 적용 알림창
export function alert() {
    $('.alert-pop').children().children().text('적용되었습니다.')
    $('.alert-type').addClass('success')
    $('.alert-type').removeClass('error')
    $('.alert-pop').css('display', 'block')

    setTimeout(function () {
        $('.alert-pop').fadeOut(500, "swing");
    }, 2000);
    return;
}

// 북마크 리스트 화면에서 글 클릭 시 오른쪽 글 카드 화면 띄움
$(document).on('click', '.booklist', function () {
    // 선택 되어있던 글일 경우 하이라이트 제거 및 우측 글 팝업 닫기
    if($(this).hasClass('highlight')){
        $(this).removeClass('highlight');
        $('.btn-close.card-popup-close.close-side').click();
        return false;
    }

    let rmNo = $(this).attr('data-project-id')
    let postNo = $(this).attr('data-post-id')
    updateRight(rmNo, postNo, -1)

    // 다른 글 하이라이트 제거 및 선택한 글 하이라이트 추가
    $('.booklist').removeClass('highlight');
    $(this).addClass('highlight');
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