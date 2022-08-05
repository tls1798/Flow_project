import {getAllRoomsAjax} from './ajax.js'
import {initRightPostCard} from './rightPostCard.js'
import {updateList} from './projectList.js';

$(document).on('click', '.project-item', function(e){

    // 즐겨찾기 버튼 클릭 시 프로젝트 선택X
    if($(e.target).hasClass('flow-content-star')){
        return false;
    }
    
    $('#mainTop').css('display','none');
    $('#detailTop').css('display','block');
    $('#projectHomeLayer').css('display','none');
    $('#feed').css('display','block');

    // 프로젝트 관리자/참여자 별 디테일 메뉴 다르게 보이도록
    getAllRoomsAjax($(this).attr('data-id'));
})

// 사이드바의 메뉴, 프로젝트 카드, 로고 클릭 시 사이드바 메뉴 active 해제 (this 제외)
$(document).on('click', '.left-menu-item, .project-item, .logo-box', function(){
    // title 변경
    if(!$(this).hasClass('project-item'))
        $(document).prop('title', '플로우(flow) - 대한민국 No.1 올인원 협업툴');

    // 내가 누른 메뉴 제외, 모두 active 해제
    $('.left-menu-item').not(this).removeClass('flow-active');
    
    // 오른쪽 글 카드 열려있으면 닫기
    if($('#popBack1>li').length > 0){
        initRightPostCard();
    }
    
    if(!$('#searchResult').hasClass('d-none')){
        $('#searchResult').addClass('d-none');
        $('.top-setting-bar #topSettingBar').css('display', 'block');
    }
});

// 내 프로젝트 메뉴 클릭 -> 프로젝트 리스트 업데이트
$(document).on('click', '.left-menu-item', function(){
    updateList();
});

// 만약 로고 클릭 시, 내 프로젝트 active + 리스트 업데이트
$(document).on('click', '.logo-box', function(){
    $('.left-menu-main').addClass('flow-active');
});