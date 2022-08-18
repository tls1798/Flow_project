import { memNo } from './ajax.js'
$(function () {
    
    // 로그아웃 된 상태
    if(memNo===null){
        $('#BtnLoginStart').attr('href', './login.html')
        $('#home_login').text('로그인');
    }
    else{
        $('#BtnLoginStart').attr('href', './main.html')
        $('#home_login').text('로그아웃');
    }
});

$('#home_login').click(function(e){
    if ($('#home_login').text() == '로그아웃') {
        logoutAjax();
    }
    else
    location.href='./login.html'
})
// 로그아웃
export function logoutAjax() {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8818/api/auth/members/' + memNo,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", window.localStorage.getItem('accessToken'));
        },
        success: function (result, status, xhr) {
            localStorage.clear();
            location.href = 'home.html'
        },
        error: function (xhr, status, err) { 
            autoaccess()
        }
    });
}