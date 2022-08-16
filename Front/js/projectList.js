import {getAllProjectsByMeAjax, addFavoriteProjectAjax, deleteFavoriteProjectAjax} from './ajax.js'

// 프로젝트 리스트 초기화 및 업데이트 함수
export function updateList() {
    // 초기화
    $('#projectBoardUl').find('li').remove();
    // 프로젝트 리스트 업데이트
    getAllProjectsByMeAjax();
}

$(function () {   
    // 불러올 때 프로젝트 리스트 초기화 및 업데이트
    updateList();
})

// 즐겨찾기 별 클릭
$(document).on('click', '.flow-content-star', function(e){
    // 현재 선택한 프로젝트 인덱스
    var rmNo = $(this).parents('.project-item').attr('data-id');

    // 즐겨찾기 해제 상태일 때 -> 즐겨찾기 등록
    if($(e.target).hasClass('flow-content-star-un')){

        // star 이미지 교체를 위한 removeClass
        $(e.target).removeClass('flow-content-star-un');

        addFavoriteProjectAjax(rmNo);
    }

    // 즐겨찾는 프로젝트 일 때 -> 즐겨찾기 취소
    else{
        // star 이미지 교체를 위한 addClass
        $(e.target).addClass('flow-content-star-un');

        deleteFavoriteProjectAjax(rmNo);
    }
})