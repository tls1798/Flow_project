import {autoaccess} from './autoAccess.js'
// 초기화
const clearInviteLayer = function(){
    $('.js-member-item').removeClass('active');
    $('#inviteTargetList').children('li').remove();
    $('.project-invite-choiceList').children('li').remove();
}
// 닫기
const closeInviteLayer = function(tar){
    if($(tar).hasClass('returnInviteModal1')){
        $('#inviteLayer').css('display', 'block');
        $('#invitePopup').css('display', 'none');
    }else{
        $('#inviteLayer').css('display', 'none');
        $('#invitePopup').css('display', 'none');
    }
}
// confirm 창 열기
const confirmOpen_invite = function(){
    $('.back-area.temp-popup').addClass('flow-all-background-1')
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')

    $('.popup-confirm-warp').addClass('invite-confirm')
    $('#popBack2').addClass('invite-confirm-popback')
}
// confirm 창 닫기
const confirmClose_invite = function(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1')
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('invite-confirm')
    $('#popBack2').removeClass('invite-confirm-popback')
}

$(function () {

    // 초대하기 버튼 클릭
    $('#openInviteLayerBtn, #noDetailDataBnt').click(function(e){
        $('#inviteLayer').css('display', 'block');
        return false;
    })

    // 참여자 초대 클릭
    $('#openTeamInvite').click(function(e){
        let accessToken = window.localStorage.getItem('accessToken')
       // getMembers
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/members',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function (result, status, xhr) {
                if(result.length == 0){
                    $('.invite-blank-txt').removeClass('d-none');
                }
                else {
                    for(var i=0; i<result.length; i++){
                        $('.project-invite-choiceList').append(`
                            <li class="js-member-item" data-id="`+result[i].memNo+`" data-name="`+result[i].memName+`">
                                <div class="my-check-2 js-select-Btn"></div>
                                <div class="post-author">
                                    <span class="js-profile thumbnail size40 radius16"
                                        style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)"
                                        data=""></span>
                                    <dl class="post-author-info">
                                        <dt>
                                            <strong id="name" class="author">`+result[i].memName+`</strong>
                                            <em></em>
                                        </dt>
                                        <dd>
                                            <strong class="company"></strong>
                                            <span class="team"></span>
                                        </dd>
                                    </dl>
                                </div>
                            </li>
                        `);
                    }
                }
            },
            error: function (xhr, status, err) {
                autoaccess()
            }
        });

        $('#inviteLayer').css('display', 'none');
        $('#invitePopup').css('display', 'block');
        return false;
    })
    
    var tar;
    // 참여자 선택한 상태에서 뒤로/취소, X, 여백 클릭
    $('.returnInviteModal1, .closeInviteLayerBtn, #inviteLayer, #invitePopup').click(function(e){

        tar = $(e.target);
        
        // 선택된 참여자가 있으면 묻기
        if($('#inviteTargetList').find('li').length!=0){
            $('.popup-cont').text('선택된 참여자가 있습니다. 나가시겠습니까?');
            confirmOpen_invite();
            
            // confirm 취소, 확인 버튼 클릭 시
            $('.popup-confirm-warp').click(function(e){
                if(!$(this).hasClass('invite-confirm'))
                    return false;

                if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
                    confirmClose_invite();
                } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
                    confirmClose_invite();
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
        if($(e.target).hasClass('invite-confirm-popback'))
        confirmClose_invite();
    })

    // 참여자 클릭
    $('#teamInviteLayer').on('click', '.js-member-item', function(e){
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

        let ntTemp = '{';
        var jsonData = "[";
        for(var i=0; i<cnt; i++){
            var curMem = $('#inviteTargetList').children('li:eq('+i+')').attr('data-id');
            if($('#participantsUl').find('li[data-id='+curMem+']').length!=0)
                continue;
            
            if(jsonData.length!=1) {
                jsonData += ",";
                ntTemp += ",";
            }
            jsonData += "{\"rmNo\":"+$('#detailSettingProjectSrno').text()+", \"memNo\":"+curMem+"}";
            ntTemp += '"'+curMem+'" : null';
        }
        jsonData += "]";
        ntTemp += "}";

        let rmNo = $('#detailSettingProjectSrno').text();

        if (jsonData.length > 2) {
            let accessToken = window.localStorage.getItem('accessToken')
            new Promise((succ,fail)=>{
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/room-members',
                    data: jsonData,
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        succ(result)
                        // 참여자 업데이트
                        $('.project-item[data-id='+rmNo+']').click();
                        // 닫기
                        $('#inviteTargetList').find('li').remove();
                        $('.closeInviteLayerBtn').click();
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            }).then((arg)=>{
                let accessToken = window.localStorage.getItem('accessToken')
                let memNo = window.localStorage.getItem('memNo')
                // 초대 알림 보내기
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/notis/rooms/'+rmNo,
                    data: JSON.stringify({"ntTypeNo":3, "ntDetailNo":null, "memNo":memNo, "rmNo":rmNo, "ntTemp":ntTemp}),
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        var socket = io.connect('http://localhost:3000');
                        socket.emit('test', true);
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            })
        }
    })

    // 초대 모달 1,2 클릭 시 display none X
    $('#inviteMainLayer, #teamInviteLayer').click(function(){
        return false;
    });
    
})