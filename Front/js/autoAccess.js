export function autoaccess() {
    let accessToken = window.localStorage.getItem('accessToken')
    let refreshToken = window.localStorage.getItem('refreshToken')
    let memNo = window.localStorage.getItem('memNo')
    $.ajax({
        type: 'POST',
        url: 'https://flow.beslee.pw/api/auth/reissue',
        data: JSON.stringify({
            memNo:memNo,
            accessToken: accessToken,
            refreshToken: refreshToken
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            let accessToken = result.accessToken
            
            window.localStorage.setItem('accessToken', accessToken);
        },
        error: function (xhr, status, err) {
            alert('로그인을 다시 해주세요')
            location.href = 'login.html'
        }
    })
}