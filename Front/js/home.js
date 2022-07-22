import logout from './logoutModule.js';

$(function(){
    let memNo= window.localStorage.getItem('memNo');
    
    // 로그아웃 된 상태
    if(memNo==='-1'){
        $('#BtnLoginStart').attr('href', './login.html')
        $('#home_login').text('로그인');
    }
    else{
        $('#BtnLoginStart').attr('href', './main.html')
        $('#home_login').text('로그아웃');
    }

    $('#home_login').click(function(e){
        if ($('#home_login').text() == '로그아웃') {
            logout();
        }
        location.href='./login.html'
    })
});