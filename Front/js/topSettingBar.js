import projectList from './projectList.js';
import {autoaccess} from './autoAccess.js'
$(function(){

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
        let accessToken = window.localStorage.getItem('accessToken')
        let memNo = window.localStorage.getItem('memNo')
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
        let accessToken = window.localStorage.getItem('accessToken')
        let memNo = window.localStorage.getItem('memNo')
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
    });

    // 프로젝트 수정
    $('#detailSettingProjectUpdateBtn').click(function(){
        $('.create-project').css('display', 'block');
        $('#createProjectButton').click();
        $('#templateReturnButton').css('display', 'none');
        $('.js-submit-project').html('수정');

        // 프로젝트 제목, 설명 넣기
    });

    // 프로젝트 삭제
    $('#detailSettingProjectDeleteBtn').click(function(){
        let accessToken = window.localStorage.getItem('accessToken')
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
            },
            error: function (xhr, status, err) {    
                autoaccess()
            }
        });
    });
});