$(function () {
    
    // 1. 각 이메일 , 이름 , 패스워드 , 체크박스에 Valdation 체크를 한다.
    // 2. 유효성 검사 후 메일에 인증코드를 발송
    // 3. 인증코드가 일치하면 회원가입

    // 회원가입 버튼 클릭시
    $('#teamStepButton').on('click', function () {
        // 폼의 값을 변수에 담아준다
        let memMail = $('#joinUserEmail').val();
        let memName = $('#joinUserName').val();
        let memPw = $('#password').val();
        
        // 각각의 검사에 통과하게 되면 true 
        let email = false;
        let name = false;
        let password = false;
        let checkpassword = false;
        let checkbox = false;
    
        // -------------- 유효성 체크 -----------------------
        // 이메일 검증
        (validEmailCheck(memMail)) ? email = true : email = false,
            $('.error-email').text($('.join-email-input').attr('data-un-valid-msg'));
        // 이름이 null이 아닌지 
        (!memName == '') ? name = true : name = false;
            $('.error-name').text($('.join-name-input').attr('data-un-valid-msg'));
        // 패스워드와 아래 패스워드가 일치하는지
        ($('#password').val() == $('#password2').val()) ?
            checkpassword = true : checkpassword = false,
            $('.error-pw2').text($('.js-join-password2').attr('data-un-valid-msg'));
        // 패스워드의 형식이 맞는지 체크
        (chkPW(memPw)) ? password = true : password = false;
        // 체크 박스가 체크 되었는지 
        ($('input:checkbox[id="joinConfirmCheck"]').is(":checked") == true)  ?
            checkbox = true :checkbox = false,
            $("br").remove('#brremove'),
            $('.js-error-text').removeClass('d-none');
        // -------------- 유효성 체크 -----------------------

        // 모든 검증에 통과하면 ajax 실행
        if (name == true && password == true && email == true && checkpassword == true && checkbox == true) {
        
            // 이메일 팝업창을 띄운다
        $('.temp-popup').addClass('flow-all-background-1')
        $('.flow-project-popup-6').removeClass('d-none')
            // 입력된 이메일에 8자리 인증 코드를 전송한다
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/auth/email',
                data: JSON.stringify({
                    memMail: memMail
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (result, status, xhr) {
                    // 이메일 전송이 완료되면 8자리 코드를 return 받는다
                    const ePw = result.ePw
                    $('.confirm-button').on('click', function () {           
                        let num = $('#authInput').val();
                        // 사용자가 입력한 인증 코드와 생성한 인증코드 일치하는지 확인
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
                                    location.href = 'login.html'
                                },
                                error: function (xhr, status, err) {}
                            });
                        } else {
                            alert('인증코드가 맞지않습니다')
                            location.href = 'signUp.html'
                        }
                    })
                },
                error: function (xhr, status, err) {}
            });
        }
        // ------------- 에러 메시지 혹은 input 비우기 ----------------
        // Value가 True 이면 에러 메시지를 지워준다 False 이면 input을 비워준다
        (email) // 이메일 칸
            ?$('.error-email').text('') : $('#joinUserEmail').val('');
        (name) // 이름칸
           ? $('.error-name').text(''): $('.join-name-input').val('');
        (password) // 패스워드 칸
         ? $('.error-pw').text(''):$('#password').val('');
        (checkpassword) // 패스워드 두번째 칸
        ? $('.error-pw2').text(''):$('#password2').val('');
        if(checkbox) { // 체크박스
        $('.js-error-text').addClass('d-none');
            $('.addbr').html('<br><br>')
        }
        else
        $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
        // ------------- 에러 메시지 혹은 input 비우기 ----------------

        // 인증 번호 치는 칸은 눌러도 팝업창이 닫히지 않게 설정
        $('.auth-popup').on('click', function () {
            if ($('.confirm-button'))
                return false;
            return false;
        })

        // 검은색 백그라운드를 눌러서 팝업 나가기
        $('.flow-project-make-2').on('click', function () {
            $('.temp-popup').removeClass('flow-all-background-1')
            $('.flow-project-popup-6').addClass('d-none')
        })

        // 이메일 정규식 검사 
        function validEmailCheck(memMail) {
            let pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return (memMail.match(pattern) != null)
        }

        // 패스워드 유효성 검사
        function chkPW(password) {

            let pw = password;
            let num = pw.search(/[0-9]/g);
            let eng = pw.search(/[a-z]/ig);
            let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
       
            if (pw.length < 8 || pw.length > 20) {
                $('.error-pw').text($('.js-join-password').attr('data-length-msg'))
                return false;
            } else if (pw.search(/\s/) != -1) {
                $('.error-pw').text($('.js-join-password').attr('data-empty-msg'))
                return false;
            } else if (num < 0 || eng < 0 || spe < 0) {
                $('.error-pw').text($('.js-join-password').attr('data-un-valid-msg'))
                return false;
            } else {
                return true;
            }
        }
    })
})