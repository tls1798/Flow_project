import {addFavoriteProjectAjax, deleteFavoriteProjectAjax} from './ajax.js'
import {updateRight} from './rightPostCard.js';

// X 클릭 시, 창 닫고 topSettingBar 활성화
$('#searchResultClose').click(function(){
    $('#searchResult').addClass('d-none');
    $('.top-setting-bar #topSettingBar').css('display', 'block');
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
$(document).on('click', '.post-search-item, .project-search-item', function(){
    $('.js-search-item').removeClass('highlight');
    $(this).addClass('highlight');
})

// 글 댓글 클릭 -> 우측 포스트 카드
$(document).on('click', '.post-search-item', function(){
    let rmNo = $(this).attr('data-project-no');
    let postNo = $(this).attr('data-post-no');
    let cmNo = -1;
    
    if($(this).find('i').hasClass('comment'))
        cmNo = $(this).attr('data-comment-no');

    updateRight(rmNo, postNo, cmNo);
})

// 프로젝트 클릭 -> 프로젝트 피드로 이동
$(document).on('click', '.project-search-item', function(){
    let rmNo = $(this).attr('data-project-no');
    $('.project-item[data-id='+rmNo+']').click();
})