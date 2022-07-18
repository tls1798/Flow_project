$(function () {
    // 회원가입 버튼 클릭시
    $('#teamStepButton').on('click', function () {
        let memMail = $('#joinUserEmail').val();
        let memName = $('#joinUserName').val();
        let memPw = $('#password').val();
        $('.temp-popup').addClass('flow-all-background-1')
        $('.flow-project-popup-6').removeClass('d-none')

        // 메일의 형식을 검사
        if (validEmailCheck(memMail) == true) {
        
            // 패스워드와 아래 패스워드가 일치하는지 판단
            if ($('#password').val() == $('#password2').val()) {
                // 패스워드의 형식이 맞는지 판단
                if (chkPW(memPw)) {
                    // 체크 박스가 체크되었는지 판단
                if ($('input:checkbox[id="joinConfirmCheck"]').is(":checked") == true) {
                   
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8080/api/auth/emailConfirm',
                        data: JSON.stringify({
                            memMail: memMail
                        }),
                        contentType: 'application/json; charset=utf-8',
                        success: function (result, status, xhr) {
                          const ePw = result.ePw;
                          $('.confirm-button').on('click', function () {
                        
                            let num = $('#authInput').val();
                           
                            if (num == ePw) {
                                $.ajax({
                                    type: 'POST',
                                    url: 'http://localhost:8080/api/auth/members/new',
                                    data: JSON.stringify({
                                        memMail: memMail,
                                        memName: memName,
                                        memPw: memPw
                                    }),
                                    contentType: 'application/json; charset=utf-8',
                                    success: function (result, status, xhr) {
                                        $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
    
                                        location.href = 'login.html'
                                    },
                                    error: function (xhr, status, err) {
                                    }
                                });
                            } else {
                                alert('인증코드가 맞지않습니다')
                                location.href = 'signUp.html'
                            }
                        })
                        },
                        error: function (xhr, status, err) {
                        }
                    });
              
                } else {
                    alert('checkbox 체크 ')
                    closesignpop()              
                    }
                } else {
                    closesignpop()
                    resetbox()
                }
            }            
            else {
                alert('비밀번호가 일치하지 않습니다')
                closesignpop()
                resetbox()
            }
        } else {
            closesignpop()
            resetbox()
            alert('올바른 이메일 주소를 입력해주세요.')

        }
    })
    // inputbox 비우기
    function resetbox() {
        $('#joinUserEmail').val('');
        $('#password').val('');
        $('#password2').val('');
        $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
    }
    // 팝업창 닫기 
    function closesignpop() {
        $('.temp-popup').removeClass('flow-all-background-1')
        $('.flow-project-popup-6').addClass('d-none')
    }

    
    // 팝업 나가기
    $('.auth-popup').on('click', function () {
        if ($('.confirm-button'))
            return false;  
            return false;    
    })
    // 팝업 나가기
    $('.flow-project-make-2').on('click', function () {
        $('.temp-popup').removeClass('flow-all-background-1')
        $('.flow-project-popup-6').addClass('d-none')
    })
      // 이메일 정규식 검사 
    function validEmailCheck(memMail){
        var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return (memMail.match(pattern)!=null)
    }
    // 패스워드 유효성 검사
    function chkPW(password){

        var pw = password;
        var num = pw.search(/[0-9]/g);
        var eng = pw.search(/[a-z]/ig);
        var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
       
        if(pw.length < 8 || pw.length > 20){
         alert("8자리 ~ 20자리 이내로 입력해주세요.");
         return false;
        }else if(pw.search(/\s/) != -1){
         alert("비밀번호는 공백 없이 입력해주세요.");
         return false;
        }else if(num < 0 || eng < 0 || spe < 0 ){
         alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
         return false;
        }else {
           return true;
        }
       
    }
})
  