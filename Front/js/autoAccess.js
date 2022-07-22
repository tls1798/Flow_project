
let expiredAt = window.localStorage.getItem('expiredAt')
    setInterval(autoaccess, expiredAt - 60000)

function autoaccess() {
    console.log('start')
    let accessToken = window.localStorage.getItem('accessToken')
    let refreshToken = window.localStorage.getItem('refreshToken')

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/auth/get-newToken',
        data: JSON.stringify({
            accessToken: accessToken,
            refreshToken: refreshToken
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            console.log('new token')
            let accessToken = result.accessToken
            window.localStorage.setItem('accessToken', accessToken);
        },
        error: function (xhr, status, err) {
            alert('로그인을 다시 해주세요')
            location.href = 'login.html'
        }
    })
}