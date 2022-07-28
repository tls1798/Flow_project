import projectList from './projectList.js';
import {autoaccess} from './autoAccess.js'

// confirm 창 열기
const confirmOpen_project_setting = function(cls){
    $('.back-area.temp-popup').addClass('flow-all-background-1');
    $('#popupBackground').removeClass('d-none')
    $('.confirm-popup').removeClass('d-none')
    
    $('.popup-confirm-warp').addClass(cls)
    $('#popBack2').addClass(cls)
}
// confirm 창 닫기
const confirmClose_project_setting = function(cls){
    $('.back-area.temp-popup').removeClass('flow-all-background-1');
    $('#popupBackground').addClass('d-none')
    $('.confirm-popup').addClass('d-none')
    
    $('.popup-confirm-warp').removeClass(cls)
    $('#popBack2').removeClass(cls)
}

$(function(){
    let accessToken = window.localStorage.getItem('accessToken')
    let memNo = window.localStorage.getItem('memNo')
    
    // 프로젝트 디테일 창 display:none -> false, block -> true
    var proejctDetailBool = false;

    // 프로젝트 디테일 버튼 클릭 시
    $("#detailSettingTopButton").click(function(){
        if(!proejctDetailBool){
            $("#detailSettingLayer").css('display', 'block');
            proejctDetailBool=!proejctDetailBool;

            // html.click 동작시키지 않기 위해 작성
            return false;
        }
    });
    
    // 프로젝트 디테일 창 클릭할 시엔 display none X
    $('#detailSettingLayer').click(function(){
        return false;
    });

    $('html').click(function() {
        // 프로젝트 디테일 창 display none
        if(proejctDetailBool) {
            $("#detailSettingLayer").css('display', 'none');
            proejctDetailBool=!proejctDetailBool;
        }
    });

    // 즐겨찾기 버튼
    $('#projectStar').click(function(e){
        // 현재 선택한 프로젝트 인덱스
        var rmNo = $('#detailSettingProjectSrno').text();

        // 즐겨찾기 해제 상태일 때 -> 즐겨찾기 등록
        if($(e.target).hasClass('unstar')){

            // star 이미지 교체를 위한 removeClass
            $(e.target).removeClass('unstar');

            // 비동기 통신
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/favorites',
                data: JSON.stringify({"rmNo": rmNo, "memNo": memNo}),
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    // 프로젝트 리스트 업데이트
                    projectList();
                },
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });
        }

        // 즐겨찾는 프로젝트 일 때 -> 즐겨찾기 취소
        else{

            // star 이미지 교체를 위한 addClass
            $(e.target).addClass('unstar');
            let accessToken = window.localStorage.getItem('accessToken')
            let memNo = window.localStorage.getItem('memNo')
            // 비동기 통신
            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/api/favorites',
                data: JSON.stringify({"rmNo": rmNo, "memNo": memNo}),
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    // 프로젝트 리스트 업데이트
                    projectList();
                },
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });
        }
    });

    // 프로젝트 나가기
    $('#detailSettingProjectExitBtn').click(function(){
        $('.popup-cont').text('프로젝트 나가기 시, 프로젝트 목록에서 삭제되며\n작성하신 게시물 확인이 불가합니다.');
        confirmOpen_project_setting('exit-confirm');
    });
    
    // 프로젝트 삭제
    $('#detailSettingProjectDeleteBtn').click(function(){
        $('.popup-cont').text('프로젝트를 삭제하시겠습니까?');
        confirmOpen_project_setting('del-confirm');
    });
    
    // confirm 취소, 확인 버튼 클릭 시
    $('.popup-confirm-warp').click(function(e){
        if($(this).hasClass('exit-confirm')){
            if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
                confirmClose_project_setting('exit-confirm');
            } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
                confirmClose_project_setting('exit-confirm');
                
                $.ajax({
                    type: 'DELETE',
                    url: 'http://localhost:8080/api/room-members/'+$('#detailSettingProjectSrno').text(),
                    data: JSON.stringify({"rmNo":$('#detailSettingProjectSrno').text(), "memNo":memNo}),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        // 프로젝트 리스트 업데이트
                        projectList();
                        // 로고 클릭하여 프로젝트 리스트로
                        $('.logo-box').click();
                    },
                    error: function (xhr, status, err) {
                        autoaccess()
                    }
                });
            } else {
                return false;
            }
        }
        else if($(this).hasClass('del-confirm')){
            if($(e.target).attr('class')=='flow-pop-sub-button-1 cancel-event'){
                confirmClose_project_setting('del-confirm');
            } else if($(e.target).attr('class')=='flow-pop-sub-button-2 submit-event'){
                confirmClose_project_setting('del-confirm');
                
                $.ajax({
                    type: 'DELETE',
                    url: 'http://localhost:8080/api/rooms/'+$('#detailSettingProjectSrno').text(),
                    beforeSend: function (xhr) {      
                        xhr.setRequestHeader("token",accessToken);
                    },
                    success: function (result, status, xhr) {
                        // 프로젝트 리스트 업데이트
                        projectList();
                        // 로고 클릭하여 프로젝트 리스트로
                        $('.logo-box').click();
                        
                        var socket = io.connect('http://localhost:3000');
                        socket.emit('test');
                    },
                    error: function (xhr, status, err) {        
                        autoaccess()    
                    }
                });
            } else {
                return false;
            }
        }
    })
    
    // confirm 외부 영역 클릭 시 닫기
    $('#popBack2').click(function(e){
        if($(e.target).hasClass('exit-confirm') || $(e.target).hasClass('del-confirm'))
            confirmClose_project_setting();
    })

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
});