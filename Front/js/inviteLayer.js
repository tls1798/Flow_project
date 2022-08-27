import {getAllMembersAjax, addMembersToProjectAjax, getProjectAjax} from './ajax.js'
import {confirmOpen, confirmClose} from './confirm.js'
import { erralert } from './bookmark.js';

// 초기화
const clearInviteLayer = function(){
    $('.js-member-item').removeClass('active');
    $('#inviteTargetList').children('li').remove();
    $('.project-invite-choiceList').children('li').remove();
}

// 초대하기 팝업 닫기
const closeInviteLayer = function(tar){
    if($(tar).hasClass('returnInviteModal1')){
        $('#inviteLayer').css('display', 'block');
        $('#invitePopup').css('display', 'none');
    }else{
        $('#inviteLayer').css('display', 'none');
        $('#invitePopup').css('display', 'none');
    }
}

// 초대하기 버튼 클릭 -> 첫 번째 팝업 display block
$(document).on('click', '#openInviteLayerBtn, #noDetailDataBnt', function(){
    // 프로젝트 삭제 여부 확인
    if(getProjectAjax(window.localStorage.getItem('rmNo')) == ''){
        // 경고창
        $('.alert-pop').children().children().text('삭제된 프로젝트입니다.');
        erralert();

        // 로고 클릭하여 프로젝트 리스트로
        $('.logo-box').click();

        return false;
    }

    $('#inviteLayer').css('display', 'block');
})

// 참여자 초대 클릭 -> 첫 번째 팝업 display none, 두 번째 팝업 display block
$('#openTeamInvite').click(function(e){
    getAllMembersAjax();

    $('#inviteLayer').css('display', 'none');
    $('#invitePopup').css('display', 'block');

    return false;
})

var tar;
// 뒤로/취소, X, 여백 클릭
$('.returnInviteModal1, .closeInviteLayerBtn, #inviteLayer, #invitePopup').click(function(e){

    tar = $(e.target);
    
    // 선택된 참여자가 있으면 confirm
    if($('#inviteTargetList').find('li').length!=0){
        $('.popup-cont').text('선택된 참여자가 있습니다. 나가시겠습니까?');
        confirmOpen('invite-confirm');
        
        // confirm 취소, 확인 버튼 클릭 시
        $('.popup-confirm-warp').click(function(e){
            if(!$(this).hasClass('invite-confirm'))
                return false;

            if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
                confirmClose('invite-confirm');
            } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
                confirmClose('invite-confirm');
                clearInviteLayer();
                closeInviteLayer(tar);
            } else {
                return false;
            }
        })
    }
    else{
        clearInviteLayer();
        closeInviteLayer(tar);

        return false;
    }
})

// confirm 외부 영역 클릭 시 닫기
$('#popBack2').click(function(e){
    if($(e.target).hasClass('invite-confirm'))
        confirmClose('invite-confirm');
})

// 참여자 클릭
$('#teamInviteLayer').on('click', '.js-member-item', function(e){
    // 이미 선택된 참여자일 경우, 선택 해제
    if($(this).hasClass('active')){
        $(this).removeClass('active');

        // 우측에서도 선택 해제
        $('#inviteTargetList').children('li[data-id='+$(this).attr('data-id')+']').remove();
    }
    else {
        $(this).addClass('active');
        $('#inviteTargetList').append(`
            <li data-id="`+$(this).attr('data-id')+`" class="js-invite-target">
                <i style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)"
                    data=""></i>
                <a href="#">
                    <span class="member-name ellipsis">`+$(this).attr('data-name')+`</span>
                </a>
                <a href="#">
                    <em class="removeMemberItem"></em>
                </a>
            </li>
        `);
    }
})

// 우측 선택된 참여자 x 클릭 시 선택 해제
$('#inviteTargetList').click(function(e){
    if($(e.target).hasClass('removeMemberItem')){
        var me = $(e.target).parent().parent();
        me.remove();

        // 좌측에서도 선택 해제
        $('.project-invite-choiceList').children('li[data-id='+me.attr('data-id')+']').removeClass('active');
    }
})

// 선택된 참여자 전체 삭제
$('#removeAllElements').click(function(){
    $('.js-member-item').removeClass('active');
    $('#inviteTargetList').children('li').remove();
})

// 선택된 참여자 ul change 시, 새로 count
$('#inviteTargetList').on('DOMSubtreeModified', function() {
    var cnt = $(this).children().length;

    if(cnt==0){
        $('.project-invite-selected-num').css('display', 'none');
        $('.right-blank-txt').removeClass('d-none');
    }
    else{
        $('.project-invite-selected-num').css('display', 'flex');
        $('.right-blank-txt').addClass('d-none');
    }

    $('#countFinalElement').text(cnt+'건 선택');
});

// 초대하기
$('#inviteMembers').click(function(){
    var cnt = $('#inviteTargetList').children().length;

    if(cnt==0){
        $('.alert-invite').css('display', 'block');
        setTimeout(function() {
            $('.alert-invite').fadeOut(500, "swing");
        }, 2000);

        return;
    }

    let ntCheck = '{';
    var jsonData = "[";
    let memlist = new Array();
    for(var i=0; i<cnt; i++){
        var curMem = $('#inviteTargetList').children('li:eq('+i+')').attr('data-id');
        if($('#participantsUl').find('li[data-id='+curMem+']').length!=0)
            continue;
        
        if(jsonData.length!=1) {
            jsonData += ",";
            ntCheck += ",";
        }
        jsonData += "{\"rmNo\":\""+$('#detailSettingProjectSrno').text()+"\", \"memNo\":\""+curMem+"\"}";
        ntCheck += '"'+curMem+'" : null';
        memlist.push(curMem)
    }

    jsonData += "]";
    ntCheck += "}";

    let rmNo = $('#detailSettingProjectSrno').text();
   
    if (jsonData.length > 2) {
        addMembersToProjectAjax(jsonData, rmNo, ntCheck,memlist)
    }

    // 닫기
    $('#inviteTargetList').find('li').remove();
    $('.closeInviteLayerBtn').click();
})

// 초대 모달 1,2 클릭 시 display none X
$('#inviteMainLayer, #teamInviteLayer').click(function(){
    return false;
});