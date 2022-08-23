import {addProjectAjax, editProjectAjax} from './ajax.js'
import {confirmOpen, confirmClose} from './confirm.js'
import { memNo } from './ajax.js'

// input, textarea 비우기
const clearCreateProject = function(){
    $('#projectTitleInput').val('');
    $('#projectContentsInput').val('');
}

// 창 닫기 -> 뒤로가기/나가기 구분하여 닫음
const closeCreateProject = function(tar){
    if($(tar).hasClass('button-close')){
        $('#projectSection').parent().css('display', 'none');
        $('.project-template-intro').css('display','flex');
        $('.project-template-main').css('display','none');
    }else{
        $('.project-template-main').css('display','none');
        $('.project-template-intro').css('display','flex');
    }
}

// 프로젝트 생성 클릭 -> 첫 번째 팝업 display none, 두 번째 팝업 display flex
$('.button-create-template').click(function(){
    $('.project-template-intro').css('display','none');
    $('.project-template-main').css('display','flex');
})

// 닫기, 뒤로가기
var tar;
$('.button-close, .button-go-back').click(function(e){
    $('#popupBackground').addClass('z-20');
    tar = $(this);

    if($('#projectTitleInput').val()!=="" || $('#projectContentsInput').val()!==""){
        $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
        confirmOpen('create-project-confirm');

        // confirm 취소, 확인 버튼 클릭 시
        $('.popup-confirm-warp').click(function(e){
            if(!$(this).hasClass('create-project-confirm'))
                return false;

            if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
                $('#popupBackground').removeClass('z-20');
                confirmClose('create-project-confirm');
            } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
                $('#popupBackground').removeClass('z-20');
                confirmClose('create-project-confirm');
                clearCreateProject();
                closeCreateProject(tar);
            } else {
                return false;
            }
        })
    }
    else{
        $('#popupBackground').removeClass('z-20');
        clearCreateProject();
        closeCreateProject(tar);
    }
});

// confirm 외부 영역 클릭 시 닫기
$('#popBack2').click(function(e){
    if($(e.target).hasClass('create-project-confirm'))
        confirmClose('create-project-confirm');
})

// 프로젝트 만들기, 수정
$('.js-submit-project').click(function(){

    if($('#projectTitleInput').val()===""){
        $('.alert-wrap').css('display', 'block');

        setTimeout(function() {
            $('.alert-wrap').fadeOut(500, "swing");
        }, 2000);

        return;
    }

    // rmNo 생성
    Date.prototype.YYYYMMDDHHMMSS = function () {
        var yyyy = this.getFullYear().toString();
        var MM = pad(this.getMonth() + 1, 2);
        var dd = pad(this.getDate(), 2);
        var hh = pad(this.getHours(), 2);
        var mm = pad(this.getMinutes(), 2)
        var ss = pad(this.getSeconds(), 2)

        return yyyy + MM + dd + hh + mm + ss;
    };
    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    var nowDate = new Date();
    var rmNo = nowDate.YYYYMMDDHHMMSS();

    if ($(this).html() == '프로젝트 만들기') {
        addProjectAjax(rmNo);
        clearCreateProject();
    }
    else {
        let title = $('#projectTitleInput').val();
        let content = $('#projectContentsInput').val();

        // 프로젝트 제목에 script 있으면 태그 제거 
        if(title.indexOf('<script>')!=-1){
            title = title.replace(/</g, '&lt');
            title = title.replace(/>/g, '&gt'); 
        }
        
        // 프로젝트 내용에 script 있으면 태그 제거 
        if(content.indexOf('<script>')!=-1){
            content = content.replace(/</g, '&lt');
            content = content.replace(/>/g, '&gt'); 
        }
        editProjectAjax(title, content);
    }

    
});