
$(function () {
    $('#findPassword').addClass('d-none')
    $('#password').keypress(function (e) {
        if (e.keyCode === 13) {
            $('#normalLoginButton').click();
        }
    })
    $('.js-password-find').on('click', function () {
        $('#loginLayer').addClass('d-none')
        $('#findPassword').removeClass('d-none')
    })
    $('#findEmailInput').val()
    $('#findSubmit').on('click', function () {
     
        console.log(memMail)
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/auth/email/new',
            data: JSON.stringify({
                memMail: memMail
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {
                $('#loginLayer').removeClass('d-none')
                $('#findPassword').addClass('d-none')
                location.href = 'login.html'
            },
            error: function (xhr, status, err) {
            }
        });
    })

    
    $('#normalLoginButton').on('click', function () {
        let id = $('#userId').val();
        let pw = $('#password').val();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/auth/members',
            data: JSON.stringify({ "memMail": id, "memPw": pw }),
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {
                console.log('로그인성공')
                let expiredAt = result.expiredAt;
                let accessToken = result.accessToken;
                let refreshToken = result.refreshToken;
                let memNo = result.memNo;

                window.localStorage.setItem('expiredAt', expiredAt);
                window.localStorage.setItem('accessToken', accessToken);
                window.localStorage.setItem('refreshToken', refreshToken);
                window.localStorage.setItem('memNo', memNo);
                location.href='main.html'           
            },
            error: function (xhr, status, err) {
             alert('로그인실패')
          
             }
        });

        // input, textarea 비우기
        $('#userId').val('');
        $('#memPw').val('');
    })
})