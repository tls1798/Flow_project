const logoutFunction = function () {
    let accessToken = window.localStorage.getItem('accessToken');
    let memNo = window.localStorage.getItem('memNo');

    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/auth/members/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", accessToken);
        },
        success: function (result, status, xhr) {
            window.localStorage.setItem('accessToken', '');
            window.localStorage.setItem('memNo', '');
            location.href = 'login.html'
        },
        error: function (xhr, status, err) { }
    });
}

export default function logout() {
    clearInterval();
    return logoutFunction();
}