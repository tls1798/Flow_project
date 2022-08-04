import {addFavoriteProjectAjax, deleteFavoriteProjectAjax} from './ajax.js'

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