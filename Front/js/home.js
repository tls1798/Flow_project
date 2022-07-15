import logoutModule from './logoutModule.js';

$(function(){
    let memNo= window.localStorage.getItem('memNo');
    console.log(memNo);
    
    // 로그아웃 된 상태
    if(memNo==''){
        $('#BtnLoginStart').attr('href', './login.html')
        $('#home_login').text('로그인');
    }
    else{
        $('#BtnLoginStart').attr('href', './main.html')
        $('#home_login').text('로그아웃');
    }

    $('#home_login').click(function(e){
        if($('#home_login').text()=='로그아웃'){
            e.preventdefault();
            logoutModule();
        }
    })
});