$(function () {
    // 비밀번호 찾기 화면 보이지 않게 설정
    $('#findPassword').addClass('d-none')

    // 비밀번호 찾기 화면이 보이고 로그인 화면을 가리기
    $('.js-password-find').on('click', function () {
        $('#loginLayer').addClass('d-none')
        $('#findPassword').removeClass('d-none')
    })
})

// 엔터를 치면 로그인이 되도록
$('#password').keypress(function (e) {
    if (e.keyCode === 13) {
        $('#normalLoginButton').click();
    }
})

// 아이디와 패스워드 공백체크 
let chkid = false;
let chkpw = false;

// 로그인 버튼을 클릭시 로그인 시도
$('#normalLoginButton').on('click', function () {
    let id = $('#userId').val();
    let pw = $('#password').val();

    // id와 pw가 공백이라면 에러 메시지를 출력한다
    if (id == '') $('.err-id').text($('#userId').attr('data-empty-msg'));
    else chkid = true;
    if (pw == '') $('.err-pw').text($('.loginpassword').attr('data-empty-msg'));
    else chkpw = true;
    
    // id와 pw가 공백이 아니라면 로그인 시도
    if (chkid == true && chkpw == true) {
        new Promise((succ, fail) => {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8818/api/auth/members',
                data: JSON.stringify({ "memMail": id, "memPw": pw }),
                contentType: 'application/json; charset=utf-8',
                success: function (result, status, xhr) {
                    succ(result);
                    $('.err-id').text('')
                    let accessToken = result.accessToken;
                    let refreshToken = result.refreshToken;
                    let memNo = result.memNo;
                    window.localStorage.setItem('accessToken', accessToken);
                    window.localStorage.setItem('refreshToken', refreshToken);
                    window.localStorage.setItem('memNo', memNo);
                },
                error: function (xhr, status, err) {
                    // input, textarea 비우기
                    $('#userId').val('');
                    $('.loginpassword').val('');
                    // 해당 회원 정보가 없다면 에러 메시지 출력
                    $('.err-pw').text($('#userId').attr('data-login-err-msg'))
                }
            });
        }).then((result) => {
            location.href = './main.html';
        })
    }
})

// 이메일의 값을 받아와서 임시 비밀번호를 메일로 전송
$('#findSubmit').on('click', function () {
    let memMail = $('#findEmailInput').val()
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8818/api/auth/email/new',
        data: JSON.stringify({
            "memMail": memMail
        }), 
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            $('#loginLayer').removeClass('d-none')
            $('#findPassword').addClass('d-none')
        },
        error: function (xhr, status, err) {
        }
    });
    location.href = './login.html';
})
