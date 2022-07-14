$(function(){
    // 참여자 영역 이동
    $(document).scroll(function(){
       $('#projectParticipants').css('transform', 'translateX(' + (0 - $(document).scrollLeft()) + 'px');
    });

    // 글 수정 삭제 창 display:none -> false, block -> true
    var postSettingBool = false;

    // 글 수정 삭제 디테일 버튼 클릭 시
    $("#postSetting").click(function(){
        if(!postSettingBool){
            $(".js-setting-layer").css('display', 'block');
            postSettingBool=!postSettingBool;
            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    });

    // 프로젝트 디테일 창 클릭할 시엔 display none X
    $('.js-setting-layer').click(function(){
        return false;
    });

    $('html').click(function() {
        // 프로젝트 디테일 창 display none
        if(postSettingBool) {
            $(".js-setting-layer").css('display', 'none');
            postSettingBool=!postSettingBool;
        }
    });

    // 글 고정
    $('.fixed-btn').click(function(e){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
        } else{
            $(this).addClass('on');
        }
    })

    // 참여자 리스트 업데이트 함수
    const updateParticipant = function(rmNo){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/rooms/'+rmNo+'/members',
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {

                // 초기화
                $('#participantsUl').find('li').remove();

                // 프로젝트 관리자
                $('.participants-admin-span').append(`
                    <li class="js-participant-item" data-id="`+result[0].memNo+`">
                        <div class="post-author">
                            <span class="js-participant-profile thumbnail size40 radius16" data=""></span>
                            <dl class="post-author-info">
                                <dt>
                                    <strong class="js-participant-name author ellipsis">`+result[0].memName+`</strong>
                                    <em class="position ellipsis" style="display:none" data=""></em>
                                </dt>
                            </dl>
                        </div>
                    </li>
                `);

                // 참여자
                for(var i=0; i<result.length; i++){
                    $('.participants-member-span').append(`
                        <li class="js-participant-item" data-id="`+result[i].memNo+`" >
                            <div class="post-author">
                                <span class="js-participant-profile thumbnail size40 radius16" data=""></span>
                                <dl class="post-author-info">
                                    <dt>
                                        <strong class="js-participant-name author ellipsis">`+result[i].memName+`</strong>
                                        <em class="position ellipsis" style="display:none" data=""></em>
                                    </dt>
                                </dl>
                            </div>
                        </li>
                    `);
                }
            },
            error: function (xhr, status, err) {}
        });
    }

    // 프로젝트 선택
    $(document).on('click', '.project-item', function(e){
        // 참여자 리스트 업데이트
        updateParticipant($(this).attr('data-id'));
    })
    
});