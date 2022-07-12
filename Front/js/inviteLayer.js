$(function () {
    // 초대하기 버튼 클릭
    $('#openInviteLayerBtn, #noDetailDataBnt').click(function(e){
        $('#inviteLayer').css('display', 'block');
        return false;
    })

    // 참여자 초대 클릭
    $('#openTeamInvite').click(function(e){

        // getMembers
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/members',
            contentType: 'application/json; charset=utf-8',
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
            error: function (xhr, status, err) {}
        });

        $('#inviteLayer').css('display', 'none');
        $('#invitePopup').css('display', 'block');
        return false;
    })

    // 뒤로, 취소
    $('.returnInviteModal1').click(function(){
        
        // 초기화
        $('.js-member-item').removeClass('active');
        $('#inviteTargetList').children('li').remove();

        // display
        $('#inviteLayer').css('display', 'block');
        $('#invitePopup').css('display', 'none');

        return false;
    })

    // X 버튼
    $('.closeInviteLayerBtn').click(function(){
        
        // 초기화
        $('.js-member-item').removeClass('active');
        $('#inviteTargetList').children('li').remove();

        // display
        $('#inviteLayer').css('display', 'none');
        $('#invitePopup').css('display', 'none');

        return false;
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

        var jsonData = "[";
        for(var i=0; i<cnt; i++){
            if(i!=0) jsonData += ",";
            jsonData += "{\"rmNo\":"+9+", \"memNo\":"+$('#inviteTargetList').children('li:eq('+i+')').attr('data-id')+"}";
        }
        jsonData += "]";

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/room-members',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {
                // 닫기
                $('.closeInviteLayerBtn').click();
            },
            error: function (xhr, status, err) {}
        });
    })

    // 초대 모달 1,2 클릭 시 display none X
    $('#inviteMainLayer, #teamInviteLayer').click(function(){
        return false;
    });

    $('html').click(function() {
        // 초대 모달 1,2 display none
        if($('#inviteLayer').css('display')=='block' || $('#invitePopup').css('display')=='block') {
            $('.closeInviteLayerBtn').click();
        }
    });
})