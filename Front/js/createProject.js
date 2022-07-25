import projectList from './projectList.js';
import {autoaccess} from './autoAccess.js'
$(function(){
   

    $('.button-close').click(function(){
        $('#projectSection').parent().css('display', 'none');
        $('.project-template-intro').css('display','flex');
        $('.project-template-main').css('display','none');
    });
    $('.button-create-template').click(function(){
        $('.project-template-intro').css('display','none');
        $('.project-template-main').css('display','flex');
    })
    $('.button-go-back').click(function(){
        $('.project-template-main').css('display','none');
        $('.project-template-intro').css('display','flex');
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
        let memNo = window.localStorage.getItem('memNo')
        var nowDate = new Date();
        var rmNo = nowDate.YYYYMMDDHHMMSS()+memNo;

        if ($(this).html() == '프로젝트 만들기') {
            let accessToken = window.localStorage.getItem('accessToken')
           
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/rooms',
                data: JSON.stringify({"rmNo":rmNo, "rmTitle":$('#projectTitleInput').val(), 
                    "rmDes":$('#projectContentsInput').val(), "rmAdmin" : memNo}),
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {
                    // 프로젝트 리스트 업데이트
                    projectList();
                    // 해당 프로젝트 피드로 이동
                    // 리팩토링 후 모듈 사용 (getRoom, updateParticipant, getPostAll, display 수정)
                },
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });
            
            // input, textarea 비우기
            $('#projectTitleInput').val('');
            $('#projectContentsInput').val('');
        }
        else {
            let accessToken = window.localStorage.getItem('accessToken')
            $.ajax({
                type: 'PUT',
                url: 'http://localhost:8080/api/rooms/'+$('#detailSettingProjectSrno').text(),
                data: JSON.stringify({"rmNo":$('#detailSettingProjectSrno').text(), "rmTitle":$('#projectTitleInput').val(), "rmDes":$('#projectContentsInput').val()}),
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {      
                    xhr.setRequestHeader("token",accessToken);
                },
                success: function (result, status, xhr) {},
                error: function (xhr, status, err) {
                    autoaccess()
                }
            });

            // input, textarea 비우기
            $('#projectTitleInput').val('');
            $('#projectContentsInput').val('');
        }

        // 새 프로젝트 생성 관련 모달 안보이도록
        $('#projectSection').parent().css('display', 'none');
        $('.project-template-intro').css('display','flex');
        $('.project-template-main').css('display','none');
    });
});