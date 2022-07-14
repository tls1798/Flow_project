$(function () {
    $('#normalLoginButton').on('click', function () {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/auth/members',
        data: JSON.stringify({ "memMail": $('#userId').val(), "memPw": $('#password').val() }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
          
            let accessToken = result.accessToken;
            let refreshToken = result.refreshToken;
            let memNo = result.memNo;
            window.localStorage.setItem('accessToken', accessToken);
            window.localStorage.setItem('refreshToken', refreshToken);
            window.localStorage.setItem('memNo', memNo);
            location.href = 'main.html'

        },
        error: function (xhr, status, err) { }
    });
    
    // input, textarea 비우기
    $('#userId').val('');
    $('#memPw').val('');
})
})