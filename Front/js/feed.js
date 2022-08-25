import {readAlarm} from './alarmLayer.js'
import {updateRight} from './rightPostCard.js';
import {readAllAlarmsByProjectAjax, addPinAjax, getAllPostsByProjectAjax, getAllPostsPinByProjectAjax, getPostsCountByProjectAjax, getPostToRightPostCardAjax, getPostToCenterPopupAjax} from './ajax.js'
import {confirmOpen, confirmClose} from './confirm.js'
import { erralert } from './bookmark.js';
import { memNo } from './ajax.js'

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

let postCount, isStart;
var offset = 0;

// 프로젝트 선택 시 해당 프로젝트에 있는 글 조회
export function getPostAll(rmNo) {
    offset = 0;
    // $('#rightComment').children().remove()
    postCount = getPostsCountByProjectAjax(rmNo);
    getAllPostsPinByProjectAjax(rmNo);
    getAllPostsByProjectAjax(rmNo, offset);
    offset = 11;
    isStart = true;
}

// 알림 레이어에서 미확인 알림 가져오는 함수
export function updateUnreadAlarmFunc(rmNo) {

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

        // 댓글 내용에 script 있으면 태그 제거 X
        if(content.indexOf('<script>') != -1){
            content = content.replace(/</g, '&lt');
            content = content.replace(/>/g, '&gt');
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

// 상단고정 팝업 종료 함수
const popupclose = function () {
    $('.flow-project-popup-6').addClass('d-none');
    $('#popupBackground').addClass('d-none');
}

// 참여자 영역 이동
$(document).scroll(function () {
    $('#projectParticipants').css('transform', 'translateX(' + (0 - $(document).scrollLeft()) + 'px');
});

// 알림레이어 변경될 시 미확인 알림/프로젝트 알림 배지 업데이트, 새 글 업데이트 버튼 활성화
$('#alarmTopCount').change(function () {
    // 미확인 알림 업데이트
    updateUnreadAlarmFunc($('#detailSettingProjectSrno').text());

    // 프로젝트 알림 배지 업데이트
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

// 새 글 업데이트 버튼 클릭
$('.post-update-button-area').click(function(){
    getPostAll(window.localStorage.getItem('rmNo'));
    $('.post-update-button-area').addClass('d-none');
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
    let cmNo = -1;

    if($(this).attr('data-type-no')==2)
        cmNo = $(this).attr('data-detail-no');

    updateRight(rmNo, postNo, cmNo);
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

// 상단고정 리스트 클릭 시
$(document).on('click','#pinPostUl',function(e){
    // 선택 되어있던 글일 경우 하이라이트 제거 및 우측 글 팝업 닫기
    if($(e.target).hasClass('highlight')){
        $(e.target).removeClass('highlight');
        $('.btn-close.card-popup-close.close-side').click();
        return false;
    }

    let rmNo, postNo; 
    new Promise((succ, fail)=>{
        rmNo = $(e.target).closest('li').attr('data-project-srno');
        postNo = $(e.target).closest('li').attr('data-post-srno');
        succ(rmNo, postNo);
    }).then((arg)=>{
        updateRight(rmNo, postNo, -1);
    })

    // 클릭한 글 하이라이트 적용
    $('.js-pin-item a').removeClass('highlight');
    $(e.target).addClass('highlight');
})

// 상단고정 아이콘 누를시
let postNo, postPin, pinid, projectNo;
$(document).on('click', '.js-pin-post', function (e) {
   
    if ($(this).attr('data-mem-id') != memNo && memNo !=  $(this).attr('data-room-id')) { 
        $('.alert-pop').children().children().text('프로젝트 관리자 + 글 작성 본인만 상단고정 설정/해제 가능합니다')
        erralert()
        return false;
    }

    postNo = ($(this).attr('data-post-srno'))
    postPin = ($(this).attr('data-post-pin'))
    pinid = ($(this).attr('id'))
    projectNo = ($(this).closest('li').attr('data-project-srno'))
    
    // 포스트핀이 0이면 포스트핀 1로 바꾸고 on이 있으면 on을 없애고 없으면 on을 만든다
    postPin == 0 ? postPin = 1 : postPin = 0

    if (postPin == 1) $('.popup-cont').text('상단고정 하시겠습니까');
    else if (postPin == 0) $('.popup-cont').text('이 글을 상단고정 해제 하시겠습니까');
    confirmOpen('postPin-confirm');
   
    // 오른쪽 카드 팝업 오류 수정
    $('.right').removeClass('flow-all-background-1')
    // 중앙 카드 팝업 오류 수정
    if (($(this).attr('id') == ('centerpin-' + postNo)))
        $('.right').addClass('flow-all-background-1')
    
    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function (e) {
        
        if (!$(this).hasClass('postPin-confirm'))
            return false;
    
        if ($(e.target).attr('class') == 'flow-pop-sub-button-1 cancel-event') {
            confirmClose('postPin-confirm');
        } else if ($(e.target).attr('class') == 'flow-pop-sub-button-2 submit-event') {
            confirmClose('postPin-confirm');
            $('#' + pinid).hasClass('on') ? $('#' + pinid).removeClass('on') : $('#' + pinid).addClass('on');
            $('#' + pinid).attr('data-post-pin')==0 ? $('#' + pinid).attr('data-post-pin', 1) : $('#' + pinid).attr('data-post-pin', 0);
            addPinAjax(postNo, postPin);

            // 오른쪽 글 카드 있을 때 오른쪽 글 카드 껐다가 킴
            if($('#rightPostCard').length>0){
                $('.btn-close.card-popup-close.close-side').click();
                getPostToRightPostCardAjax(projectNo, postNo, -1);
            }

            // 중앙 팝업 있을 때 중앙 팝업 껐다가 킴
            if($('#detailPostCard').length>0){
                $('.btn-close.card-popup-close.close-detail').click();
                getPostToCenterPopupAjax(projectNo, postNo, -1);
                $('#postPopup').addClass('flow-all-background-1');
            }
          
        } else {
            return false;
        }
    })

    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function (e) {
        if ($(e.target).hasClass('postPin-confirm'))
            confirmClose('postPin-confirm');
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

let maxHeight, currentScroll;
var timerForThrottle;

// 상단 이동 버튼 화면에 띄우기
$('#detailTimeline').scroll(function(){
    let rmNo = $('#detailSettingProjectSrno').text();
    let detailTimeLine = this;

    // 상단 이동 버튼
    if($(detailTimeLine).scrollTop()>20) $('.btnMoveTop').fadeIn();
    else $('.btnMoveTop').fadeOut();

    // 처음 피드에 들어 왔을 때 초기 설정
    if(isStart){
        maxHeight = detailTimeLine.scrollHeight;
        currentScroll = $(detailTimeLine).scrollTop();
        isStart = !isStart;
    }
    currentScroll = $(detailTimeLine).scrollTop();

    // 중복 호출 방지, 스크롤이 마지막에 도달 했을 때
    if(!timerForThrottle && maxHeight <= (currentScroll + $('#detailTimeline')[0].offsetHeight + 500) ){
        timerForThrottle = setTimeout(function(){
            if(offset<postCount){
                getAllPostsByProjectAjax(rmNo, offset)
                offset+=10;
                maxHeight = detailTimeLine.scrollHeight;
            }
            timerForThrottle=null;
        },200);
    }
});

// 상단 이동 버튼 클릭 시 상단 이동
$(".btnMoveTop").click(function(){
    $('#detailTimeline').animate({scrollTop:0},400);
    return false;
});