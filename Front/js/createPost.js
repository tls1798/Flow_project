import {addPostAjax, editPostAjax, removePostAjax} from './ajax.js'
import {confirmOpen_post, confirmClose_post} from './confirm.js'
import {initRightPostCard} from './rightPostCard.js'
import fontSizePlugin from './fontSize.js';
import { erralert } from './bookmark.js';

// 글 생성 팝업 열기
export function postPopupOpen(){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('.create-post-wrap').css('display','block');
}
// 글 생성 팝업 닫기
export function postPopupClose(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1');
    $('.create-post-wrap').css('display','none');
}
// 글 생성 팝업 초기화
export function postInit(){
    $('.js-create-post-title.create-post-title').text('게시물 작성');
    $('.create-post-submit').removeClass('d-none');
    $('.js-editing-buttons').addClass('d-none');
}
// 제목, 내용 비우기
export function postClear(){
    $('#postTitle').val('');
    $('.ProseMirror.toastui-editor-contents').empty();
}
// 글 수정으로 바꾸기
export function postEditor(){
    $('.js-create-post-title.create-post-title').text('글 수정');
    $('.create-post-submit').addClass('d-none');
    $('.js-editing-buttons').removeClass('d-none').css('display','inline-block');
}

const toastEditor = function () {
    // Toast ui editor
    const Editor = toastui.Editor;
    const editor = new Editor({
        el: document.querySelector('#editor'),
        height: '600px',
        hideModeSwitch: true,
        toolbarItems: [
            ['bold', 'italic', 'strike'],
            ['ul', 'ol', 'task']
        ],
        plugins: [fontSizePlugin],
        initialEditType:'wysiwyg',
    });
}

// 글 생성 버튼 클릭 시 글 생성 팝업 보이기 
$('#createPostArea').click(function(){
    // 오른쪽 글 카드 열려있으면 닫기
    initRightPostCard();
    postPopupOpen();
    toastEditor();
    postClear();
})

// 글 작성 닫기
$('.btn-close').click(function(){
    // 내용 있을 때 confirm 창
    const checkTitle = $(this).closest('.js-popup-before').find('#postTitle').val();
    const checkContent = $('.ProseMirror.toastui-editor-contents').text();

    if(checkTitle || checkContent){
        $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
        confirmOpen_post();
    } else{
        postPopupClose()
    }
})

// back-area 선택 시 사라지게
$('#popBack1').mousedown(function(e){
    if(e.target.id=='popBack1' && $('.create-post-wrap').css('display')=='block'){
        // 내용 있을 때 confirm 창
        const checkTitle = $('#postTitle').val();
        const checkContent = $('.ProseMirror.toastui-editor-contents').text();
        if(checkTitle || checkContent){
            $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
            confirmOpen_post();
        }else{
            postPopupClose();
        }
    }
})

// confirm 취소, 확인 버튼 클릭 시
$('.popup-confirm-warp').click(function(e){
    if(!$(this).hasClass('post-confirm'))
        return false;
    
    if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
        confirmClose_post();
    } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
        confirmClose_post();
        postPopupClose();
        postInit();
        postClear();
    } else {
        return false;
    }
})

// confirm 외부 영역 클릭 시 닫기
$('#popBack2').click(function(e){
    if($(e.target).hasClass('post-confirm-popback'))
        confirmClose_post();
})

// 글 작성 영역 클릭 시 닫기 안되게
$('.create-post-wrap').click(function(e){

    // 글 쓰기 버튼 클릭 시
    if (e.target.type == 'submit') {
        // 내용 없으면 경고창
        const checkContent = $('.ProseMirror.toastui-editor-contents').text();
        if(checkContent===""){
        $('.alert-pop').children().children().text('내용을 입력하세요.')
        erralert()
        return false;
        }

        let postTitle = $('#postTitle').val();
        let postContent = $('.ProseMirror.toastui-editor-contents')[0].innerHTML;
        let rmNo = $('#detailSettingProjectSrno').text();

        let postNo = 0;
        let ntCheck ='{';
        
        // 글 제목에 script 있으면 태그 제거 
        if(postTitle.indexOf('<script>')!=-1){
            postTitle = postTitle.replace(/</g, '&lt');
            postTitle = postTitle.replace(/>/g, '&gt'); 
        }

        // 글 내용에 script 있으면 태그 제거 
        if(postContent.indexOf('<script>')!=-1){
            postContent = postContent.replace(/</g, '&lt');
            postContent = postContent.replace(/>/g, '&gt'); 
        }
        addPostAjax(rmNo, postNo, postTitle, postContent, ntCheck);

        postPopupClose();
        postClear();
    } 
    else{
        return false;
    }
})

$(document).on('click', '.post-option>ul',function(e){
    // 북마크 화면에서 오른쪽 글카드 수정시 북마크 업데이트
    let isBookmarkList = $('#mainTop').text();

    // document프로젝트 타이틀
    let documentTitle = '';
    let centerPopup = '';
    // 글 수정
    if(e.target.id=='postEditBtn' || e.target.id=='rightEditBtn' || e.target.id=='centerEditBtn'){
        // 글 생성 팝업 띄우고 수정으로 변경
        postEditor();
        postPopupOpen();
        toastEditor();
        
        // 기존 값 가져오기
        let title = $(this).closest('.post-card-scroll').find('.post-title').text();
        let content = $(this).closest('.post-card-scroll').find('#originalPost')[0].innerHTML;
        const rmNo = $(this).closest('li').attr('data-project-srno');
        const postNo = $(this).closest('li').attr('data-post-srno');
        $('#postTitle').val(title);
        $('.ProseMirror.toastui-editor-contents').html(content);

        // 오른쪽 글 카드 있을 때
        if(e.target.id=='rightEditBtn'){
            $('#rightComment').children().remove();
            $('#popBack1>li').children().remove()
            $('#popBack1>li').remove();
        }

        // 중앙 팝업 있을 때
        if(e.target.id=='centerEditBtn'){
            centerPopup = $('.js-project-title-button').text();
            $('#detailComment').children().remove();
            $('#popBack1>li').children().remove()
            $('#popBack1>li').remove();
            documentTitle = $(document).prop('title');
        }

        // 취소 버튼
        $('.cancel-button.create-post-button').click(function(e){
            $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
            confirmOpen_post();
        })
        
        // 확인 버튼
        $("#createPostSubmit").off().on('click', function(){
            let editTitle = $(this).closest('.js-editor').find('input').val();
            let editContent = $('.ProseMirror.toastui-editor-contents')[0].innerHTML;

            // 글 제목에 script 있으면 태그 제거 
            if(editTitle.indexOf('<script>')!=-1){
                editTitle = editTitle.replace(/</g, '&lt');
                editTitle = editTitle.replace(/>/g, '&gt'); 
            }
            
            // 글 내용에 script 있으면 태그 제거 
            if(editContent.indexOf('<script>')!=-1){
                editContent = editContent.replace(/</g, '&lt');
                editContent = editContent.replace(/>/g, '&gt'); 
            }
            editPostAjax(rmNo, postNo, editTitle, editContent, isBookmarkList, documentTitle, centerPopup);
        })

    }
    else if(e.target.id=='postDelBtn' || e.target.id=='rightDelBtn' || e.target.id=='centerDelBtn'){
        // 글 삭제
        let rmNo = $(e.target).closest("[id^='post-']").attr('data-project-srno');
        const postNo = $(e.target).closest("[id^='post-']").attr('data-post-srno');
        documentTitle = $(document).prop('title');
        let projectTitle = '';
        // 오른쪽 글 카드 있을 때
        if(e.target.id=='rightDelBtn'){
            projectTitle = $('.js-project-title-button').text();
            $('#rightComment').children().remove();
            $('#popBack1>li').children().remove()
            $('#popBack1>li').remove();
        }

        // 중앙 팝업 있을 때
        if(e.target.id=='centerDelBtn'){
            projectTitle = $('.js-project-title-button').text();
            $('#detailComment').children().remove();
            $('#popBack1>li').children().remove()
            $('#popBack1>li').remove();
        }
        
        removePostAjax(rmNo, postNo, isBookmarkList, documentTitle, projectTitle);
    }
        
    return false
})