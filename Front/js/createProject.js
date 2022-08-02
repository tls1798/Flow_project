import {addProjectAjax, editProjectAjax} from './ajax.js'

// input, textarea 비우기
const clearCreateProject = function(){
    $('#projectTitleInput').val('');
    $('#projectContentsInput').val('');
}
// 창 닫기
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
// confirm 창 열기
const confirmOpen_create_project = function(){
    $('.back-area.temp-popup').addClass('flow-all-background-1')
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')

    $('.popup-confirm-warp').addClass('create-project-confirm')
    $('#popBack2').addClass('create-project-confirm-popback')
}
// confirm 창 닫기
const confirmClose_create_project = function(){
    $('.back-area.temp-popup').removeClass('flow-all-background-1')
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')

    $('.popup-confirm-warp').removeClass('create-project-confirm')
    $('#popBack2').removeClass('create-project-confirm-popback')
}

$(function(){
    // 프로젝트 생성
    $('.button-create-template').click(function(){
        $('.project-template-intro').css('display','none');
        $('.project-template-main').css('display','flex');
    })
    // 닫기, 뒤로가기
    var tar;
    $('.button-close, .button-go-back').click(function(e){

        tar = $(this);

        if($('#projectTitleInput').val()!=="" || $('#projectContentsInput').val()!==""){
            $('.popup-cont').text('작성을 중단하고 이동하시겠습니까?');
            confirmOpen_create_project();

            // confirm 취소, 확인 버튼 클릭 시
            $('.popup-confirm-warp').click(function(e){
                if(!$(this).hasClass('create-project-confirm'))
                    return false;

                if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
                    confirmClose_create_project();
                } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
                    confirmClose_create_project();
                    clearCreateProject();
                    closeCreateProject(tar);
                } else {
                    return false;
                }
            })
        }
        else{
            clearCreateProject();
            closeCreateProject(tar);
        }
    });

    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('create-project-confirm-popback'))
        confirmClose_invite();
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
        var rmNo = nowDate.YYYYMMDDHHMMSS()+window.localStorage.getItem('memNo');

        if ($(this).html() == '프로젝트 만들기') {
            addProjectAjax(rmNo);
            clearCreateProject();
        }
        else {
            let title = $('#projectTitleInput').val();
            let content = $('#projectContentsInput').val();

            editProjectAjax(title, content);
        }

        // 새 프로젝트 생성 관련 모달 안보이도록
        $('#projectSection').parent().css('display', 'none');
        $('.project-template-intro').css('display','flex');
        $('.project-template-main').css('display','none');
    });
});