import {addFavoriteProjectAjax, deleteFavoriteProjectAjax} from './ajax.js'
import {updateRight} from './rightPostCard.js';
import {getFeed} from './changeMainContainer.js'

// X 클릭 시, 창 닫고 topSettingBar 활성화
$('#searchResultClose').click(function(){
    $('#searchResult').addClass('d-none');
    $('.top-setting-bar #topSettingBar').css('display', 'block');

    // 창 닫고 나서 피드 화면으로 돌아갈 경우
    if($('#detailTop').css('display')=='block'){
        // title 변경
        $(document).prop('title', $('#projectTitle').text());
    }
});

// 즐겨찾기 아이콘 클릭
$(document).on('click', '.js-star-icon.seach-star-type-1', function(e){
    let rmNo = $(e.target).closest('.project-search-item.js-search-item').attr('data-project-no');

    // 즐겨찾기 등록
    if($(e.target).hasClass('unstar')) {
        $(e.target).removeClass('unstar');
        addFavoriteProjectAjax(rmNo);
    }
    else {
        $(e.target).addClass('unstar');
        deleteFavoriteProjectAjax(rmNo);
    }
})

// 검색 결과 li 클릭 -> highlight class 추가
$(document).on('click', '.post-search-item.js-search-item, .project-search-item.js-search-item', function(e){
    // 프로젝트 즐겨찾기 별 클릭 시 return false
    if($(e.target).hasClass('seach-star-type-1'))
        return false;

    // 선택 되어있던 글일 경우 하이라이트 제거 및 우측 글 팝업 닫기
    if($(this).hasClass('highlight')){
        $(this).removeClass('highlight');
        $('.btn-close.card-popup-close.close-side').click();
        return false;
    }

    $('.js-search-item').removeClass('highlight');
    $(this).addClass('highlight');
})

// 글 댓글 클릭 -> 우측 포스트 카드
$(document).on('click', '.post-search-item.js-search-item', function(){
    // highlight 상태일 때만 우측 포스트 카드 활성화
    if(!$(this).hasClass('highlight'))
        return false;

    let rmNo = $(this).attr('data-project-no');
    let postNo = $(this).attr('data-post-no');
    let cmNo = -1;
    
    if($(this).find('i').hasClass('comment'))
        cmNo = $(this).attr('data-comment-no');

    updateRight(rmNo, postNo, cmNo);
})

// 프로젝트 클릭 -> 프로젝트 피드로 이동
$(document).on('click', '.project-search-item', function(e){
    // 프로젝트 즐겨찾기 별 클릭 시 return false
    if($(e.target).hasClass('seach-star-type-1'))
        return false;

    let rmNo = $(this).attr('data-project-no');
    getFeed(rmNo);

    // 검색 창 닫기
    $('#searchResultClose').click();
    // 우측 포스트 카드 닫기
    $('.btn-close.card-popup-close.close-side').click();
})