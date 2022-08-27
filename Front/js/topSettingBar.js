import {exitProjectAjax, removeProjectAjax, addFavoriteProjectAjax, deleteFavoriteProjectAjax, getProjectAjax} from './ajax.js';
import {confirmOpen, confirmClose} from './confirm.js'
import { erralert } from './bookmark.js';

// 즐겨찾기 버튼
$('#projectStar').click(function(e){
    // 현재 선택한 프로젝트 인덱스
    var rmNo = $('#detailSettingProjectSrno').text();

    // 즐겨찾기 해제 상태일 때 -> 즐겨찾기 등록
    if($(e.target).hasClass('unstar')){
        // star 이미지 교체를 위한 removeClass
        $(e.target).removeClass('unstar');

        addFavoriteProjectAjax(rmNo);
    }

    // 즐겨찾는 프로젝트 일 때 -> 즐겨찾기 취소
    else{
        // star 이미지 교체를 위한 addClass
        $(e.target).addClass('unstar');

        deleteFavoriteProjectAjax(rmNo);
    }
});

// 프로젝트 디테일 버튼 클릭 -> 디테일 팝업 display block, none
$("#detailSettingTopButton").click(function(){
    if($("#detailSettingLayer").css('display')=='block'){
        $("#detailSettingLayer").css('display','none');
    } 
    else{
        $("#detailSettingLayer").css('display','block');
    }
});

// 프로젝트 수정
$('#detailSettingProjectUpdateBtn').click(function(){
    $('.create-project').css('display', 'block');
    $('#createProjectButton').click();
    $('#templateReturnButton').css('display', 'none');
    $('.js-submit-project').html('수정');

    // 프로젝트 제목, 설명 넣기
    $('#projectTitleInput').val($('#projectTitle').text());
    $('#projectContentsInput').val($('#projectContents').text());
});

// 프로젝트 나가기
$('#detailSettingProjectExitBtn').click(function(){
    // 프로젝트 삭제 여부 확인
    if(getProjectAjax(window.localStorage.getItem('rmNo')) == ''){
        // 경고창
        $('.alert-pop').children().children().text('삭제된 프로젝트입니다.');
        erralert();

        // 로고 클릭하여 프로젝트 리스트로
        $('.logo-box').click();

        return false;
    }

    $('.popup-cont').text('프로젝트 나가기 시, 프로젝트 목록에서 삭제되며\n작성하신 게시물 확인이 불가합니다.');
    confirmOpen('exit-confirm');
});

// 프로젝트 삭제
$('#detailSettingProjectDeleteBtn').click(function(){
    $('.popup-cont').text('프로젝트를 삭제하시겠습니까?');
    confirmOpen('del-confirm');
});

// confirm 취소, 확인 버튼 클릭 시
$('.popup-confirm-warp').click(function(e){
    if($(this).hasClass('exit-confirm')){
        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose('exit-confirm');
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose('exit-confirm');
            exitProjectAjax($('#detailSettingProjectSrno').text());
        } else {
            return false;
        }
    }
    else if($(this).hasClass('del-confirm')){
        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose('del-confirm');
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose('del-confirm');
            removeProjectAjax($('#detailSettingProjectSrno').text());
        } else {
            return false;
        }
    }
})

// confirm 외부 영역 클릭 시 닫기
$('#popBack2').click(function(e){
    if($(e.target).hasClass('exit-confirm')) confirmClose('exit-confirm');
    else if($(e.target).hasClass('del-confirm')) confirmClose('del-confirm');
})

// 프로젝트 디테일 창 클릭할 시엔 display none X
$('#detailSettingLayer').click(function(){
    return false;
});

$('html').click(function(e) {
    // 프로젝트 디테일 창 display none
    if(!$(e.target).closest('#detailSettingTopButton').length > 0 && $("#detailSettingLayer").css('display')=='block'){
        $("#detailSettingLayer").css('display','none');
    } 
});