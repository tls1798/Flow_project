import {getRoomAjax, getAllParticipantsAjax} from './ajax.js'
import {initRightPostCard} from './rightPostCard.js'
import {updateList} from './projectList.js';
import { updateUnreadAlarmFunc, getPostAll } from './feed.js';
import { memNo } from './ajax.js'

// 선택한 프로젝트 정보 가져오기
export function getFeed(rmNo){
    $('#mainTop').css('display','none');
    $('#detailTop').css('display','block');
    $('#projectHomeLayer').css('display','none');
    $('#feed').css('display','block');

    // 선택한 방 정보 가져오기
    var rmInfo = getRoomAjax(rmNo, rmInfo);

    // 브라우저 title 프로젝트명으로 변경
    $(document).prop('title', rmInfo.rmTitle);

    // TopSettingBar, inviteTitle 업데이트
    updateTopSettingBar(rmNo, rmInfo.rmTitle, rmInfo.rmDes, rmInfo.rmAdmin==memNo, rmInfo.favoriteProject);

    // 참여자 리스트 업데이트
    getAllParticipantsAjax(rmNo);

    // 글, 댓글 가져오기
    getPostAll(rmNo);

    // 알림 레이어에서 미확인 알림 가져오기
    updateUnreadAlarmFunc(rmNo);
}

// TopSettingBar, inviteTitle 업데이트 함수
const updateTopSettingBar = function (rmNo, rmTitle, rmDes, rmAdmin, favoriteProject) {
    $('#detailSettingProjectSrno').text(rmNo);
    $('#projectTitle').text(rmTitle);
    $('#projectContents').text(rmDes);
    $('#inviteTitle').text(rmTitle);

    // 프로젝트 관리자/참여자 별 디테일 메뉴 다르게 보이도록
    // 사용자가 관리자일 때
    if(rmAdmin){
        $('#detailSettingProjectExitBtn').css('display', 'none');
        $('#detailSettingProjectUpdateBtn').css('display', 'block');
        $('#detailSettingProjectDeleteBtn').css('display', 'block');
    }
    // 사용자가 참여자일 때
    else{
        $('#detailSettingProjectExitBtn').css('display', 'block');
        $('#detailSettingProjectUpdateBtn').css('display', 'none');
        $('#detailSettingProjectDeleteBtn').css('display', 'none');
    }

    // 프로젝트 내부 즐겨찾기
    if (!favoriteProject) {
        $('#projectStar').addClass('unstar');
    } else {
        $('#projectStar').removeClass('unstar');
    }
}

$(document).on('click', '.project-item', function(e){

    let rmNo = $(this).attr('data-id');

    // 선택한 방 정보 가져오기
    var rmInfo = getRoomAjax(rmNo, rmInfo);
    // 삭제된 프로젝트일 경우
    if(rmInfo==''){
        // 경고창
        $('.alert-del-project').css('display', 'block');
        setTimeout(function() {
            $('.alert-del-project').fadeOut(500, "swing");
        }, 2000);

        // 새로고침
        $('.logo-box').click();

        return false;
    }

    // 즐겨찾기 버튼 클릭 시 프로젝트 선택X
    if($(e.target).hasClass('flow-content-star')){
        return false;
    }
    
    getFeed(rmNo);
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
$(document).on('click', '.left-menu-item, .logo-box', function(){
    updateList();
});

// 만약 로고 클릭 시, 내 프로젝트 active + 리스트 업데이트
$(document).on('click', '.logo-box', function(){
    $('.left-menu-main').addClass('flow-active');
});