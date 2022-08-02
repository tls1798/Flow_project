import {readAlarm} from './alarmLayer.js'
import {updateRight} from './rightPostCard.js';
import {getAllParticipantsAjax, readAllAlarmsByProjectAjax, getAllPostsByProjectAjax, addPinAjax} from './ajax.js'

// Toast ui viewer 
export function view(idx) {
    const viewer = new toastui.Editor.factory({
        el: document.querySelector('.viewer' + idx),
        viewer: true,
        height: '500px',
        hideModeSwitch: true,
        initialEditType: 'wysiwyg'
    });
}

// 프로젝트 선택 시 해당 프로젝트에 있는 글 조회
export function getPostAll(rmNo) {
    $('#rightComment').children().remove()
    getAllPostsByProjectAjax(rmNo);
}

// TopSettingBar, inviteTitle 업데이트 함수
const updateTopSettingBar = function (rmNo, rmTitle, rmDes) {
    $('#detailSettingProjectSrno').text(rmNo);
    $('#projectTitle').text(rmTitle);
    $('#projectContents').text(rmDes);
    $('#inviteTitle').text(rmTitle);
}

// 상단고정 팝업 종료 함수
const popupclose = function () {
    $('.flow-project-popup-6').addClass('d-none');
    $('#popupBackground').addClass('d-none');
}

// 알림 레이어에서 미확인 알림 가져오는 함수
const updateUnreadAlarmFunc = function (rmNo) {

    // 초기화
    $('#projectAlarmArea').css('display', 'none');
    $('#notReadAlarmUl li').remove();
    $('#projectNotReadCount').text(0);

    let cnt = 0;

    // 현재 프로젝트의 미확인알림 갯수
    $('#alarmUl li.on').each(function (idx, item) {
        let alarmRmNo = $(item).attr('data-project-no');
        let ntNo = $(item).attr('data-notis-no');
        let ntTypeNo = $(item).attr('data-type-no');
        let ntDetailNo = $(item).attr('data-detail-no');
        let postNo = $(item).attr('data-post-no');
        let des = $(item).find('.alarm-tit-ellipsis').text();
        let content = $(item).find('.alarm-cont').text();
        let elTime = $(item).find('.alarm-datetime').text();
        let displayStyle = cnt >= 3 ? 'style="display:none"' : 'style="display:table"';
    
        // 현재 프로젝트와 일치하지 않으며, 추가된 미확인 알림이 하나도 없을 경우
        if (alarmRmNo !== rmNo || ntTypeNo == 3) {
            if ($('#notReadAlarmUl li').length == 0)
                $('#projectAlarmArea').css('display', 'none');

            return true;
        }
    
        $('#projectAlarmArea').css('display', 'block');
        $('#projectNotReadCount').text(++cnt);
        $('#notReadAlarmUl').append(`
        <li class="not-read-alarm-item" data-project-no=`+ alarmRmNo + ` data-notis-no=` + ntNo + ` data-type-no=` + ntTypeNo + ` data-detail-no=` + ntDetailNo + ` data-post-no=` + postNo + ` ` + displayStyle + `>
            <div class="unidentified-item profile">
                <span class="thumbnail size40 radius16" style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)" data=""></span>
            </div>
            <div class="middle-wr">
                <div class="unidentified-item title">
                    <em class="unidentified-name"><i class=""></i>`+ des + `</em>
                    <span class="unidentified-time">`+ elTime + `</span>
                </div>
                <div class="unidentified-item task">
                    <div class="unidentified-task-content">
                        <span style="display:block" data="">`+ content + `</span>
                    </div>
                </div>
            </div>
            <div class="unidentified-item button">
                <button type="button" class="unidentified-detail-btn">
                    보기
                </button>
            </div>
        </li>
    `);
    });

    if (cnt > 3) {
        $('#notReadAlarmMore').css('display', 'block');
        $('.not-read-alarm-item:eq(2)').css('padding', '10px 20px 20px 20px');
    }
}

// confirm 창 열기
const confirmOpen_postPin = function(){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')

    $('.popup-confirm-warp').addClass('postPin-confirm')
    $('#popBack2').addClass('postPin-confirm-popback')
}
// confirm 창 닫기
const confirmClose_postPin = function(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1');
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('postPin-confirm')
    $('#popBack2').removeClass('postPin-confirm-popback')
}

// 참여자 영역 이동
$(document).scroll(function () {
    $('#projectParticipants').css('transform', 'translateX(' + (0 - $(document).scrollLeft()) + 'px');
});

// 글 고정
$('.fixed-btn').click(function (e) {
    if ($(this).hasClass('on')) {
        $(this).removeClass('on');
    } else {
        $(this).addClass('on');
    }
})

// 프로젝트 선택
var getpinPosts;
$(document).on('click', '.project-item', function (e) {

    // 참여자 리스트 업데이트
    getAllParticipantsAjax($(this).attr('data-id'));

    // TopSettingBar, inviteTitle 업데이트
    updateTopSettingBar($(this).attr('data-id'), $(this).attr('data-rm-title'), $(this).attr('data-rm-des'));

    // 글, 댓글 가져오기
    getPostAll($(this).attr('data-id'));

    // 상단고정에서 사용할 변수에 값 담기
    getpinPosts = $(this).attr('data-id');

    // 알림 레이어에서 미확인 알림 가져오기
    updateUnreadAlarmFunc($(this).attr('data-id'));

        // 프로젝트 내부 즐겨찾기
    if ($(this).find('.project-star').hasClass('flow-content-star-un')) {
        $('#projectStar').addClass('unstar')
    } else {
        $('#projectStar').removeClass('unstar')
    }
})

// 알림레이어 변경될 시 프로젝트 알림 배지 업데이트
$('#alarmTopCount').change(function () {
    updateUnreadAlarmFunc($('#detailSettingProjectSrno').text());

    $('.project-item').each(function (idx, item) {
        let rmNo = $(item).attr('data-id');
        
        // 초기화
        $('.project-item[data-id=' + rmNo + ']').find('.project-badge').css('display', 'none');
        $('.project-item[data-id=' + rmNo + ']').find('.project-badge').text(0);

        let cnt = $('#alarmUl li.on[data-project-no=' + rmNo + ']').length
        if (cnt > 0) {
            $('.project-item[data-id=' + rmNo + ']').find('.project-badge').css('display', 'block');
            $('.project-item[data-id=' + rmNo + ']').find('.project-badge').text(cnt);
        }
    })
})

// 미확인 알림 더보기 클릭
$('#notReadAlarmMore').click(function () {
    var cnt = 10;

    $('.not-read-alarm-item').each(function (idx, item) {
        if ($(item).css('display') == 'table') return true;
        if (cnt == 10) $('.not-read-alarm-item:eq(' + (idx - 1) + ')').css('padding', '10px 20px 10px 20px');
        if (--cnt >= 0) $(item).css('display', 'table');
        if (cnt == 0) $('.not-read-alarm-item:eq(' + idx + ')').css('padding', '10px 20px 20px 20px');
    })
    
    if ($('#notReadAlarmUl .not-read-alarm-item:hidden').length == 0)
        $('#notReadAlarmMore').css('display', 'none');
})

// 미확인 모두 읽기
$('#readAllPostBnt').click(function () {
    readAllAlarmsByProjectAjax();
})

// 미확인 알림 읽기
$(document).on('click', '.not-read-alarm-item', function (e) {
    let rmNo = $(this).attr('data-project-no');
    let postNo = $(this).attr('data-post-no');

    updateRight(rmNo, postNo);
    readAlarm($(this).attr('data-notis-no'), postNo);
})

// 이전 댓글 더보기 클릭할시
$(document).on('click', '.comment-more-button', function () {
    // 남은 댓글의 수
    let cmcnt = $(this).closest('.comment-header').find('#cm-count-id').text()
    let cnt = 10;
    
    $($(this).closest('.post-card-footer.js-comment-area').find('.remark-item').get().reverse()).each(function (idx, item) {
        // 처음 보여주는 댓글 2개를 빼고 시작하기 위함
        if ($(this).hasClass('d-none')) {
            if (--cnt >= 0) {
                $(item).removeClass('d-none');
                cmcnt--;
            }
        }
    })
    // 남은 댓글이 없을시 버튼을 삭제하기 위함
    if (cmcnt == 0)
        $(this).addClass('d-none')

    $(this).closest('.comment-header').find('#cm-count-id').text(cmcnt);
})

// 상단 고정 누를시
$(document).on('click', '.js-pin-post', function (e) {

    // 제출 누르면 저 클래스가 사라져서 임의로 추가해져서 팝업창을 계속 띄우게 유지함
    $('#popupBackground').addClass('flow-all-background-1');

    let postNo = ($(this).attr('data-post-srno'))
    let postPin = ($(this).attr('data-post-pin'))
    let pinid = ($(this).attr('id'))

    if ($(this).attr('data-post-pin') == 0)
        $(this).attr('data-post-pin', 1)
    else
        $(this).attr('data-post-pin', 0)

    // 포스트핀이 0이면 포스트핀 1로 바꾸고 on이 있으면 on을 없애고 없으면 on을 만든다
    postPin == 0 ? postPin = 1 : postPin = 0

    if (postPin == 1) $('.popup-cont').text('상단고정 하시겠습니까');
    else if (postPin == 0) $('.popup-cont').text('이 글을 상단고정 해제 하시겠습니까');
    confirmOpen_postPin();

    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function(e){
        if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
            confirmClose_postPin('postPin-confirm');
        } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
            confirmClose_postPin('postPin-confirm');
            $('#' + pinid).hasClass('on') ? $('#' + pinid).removeClass('on') : $('#'+pinid).addClass('on')
            addPinAjax(postNo, postPin, getpinPosts);
        } else {
            return false;
        }
    })
    
    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('postPin-confirm-popback'))
            confirmClose_postPin();
    })

    // 취소 시키기
    $('.flow-pop-sub-button-1').on('click', function () {
        popupclose();
    })
})

// 글 디테일 버튼 클릭 시
$(document).on('click', '#postSetting', function (e) {
    let postDetailBool = $(this).next().hasClass('d-none');
        if (postDetailBool) {
            $(this).next().removeClass('d-none');
        } else {
            $(this).next().addClass('d-none');
        }
    return false;
})
    
// 아무 곳 클릭 시 글 디테일 버튼 사라지게 
$('html').click(function(){
    if($('.js-setting-ul.js-setting-layer.setup-group').hasClass('d-none')){
        $('.js-setting-ul').addClass('d-none');
    }
})