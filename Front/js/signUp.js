import {postEmailCodeAjax} from './ajax.js'

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

    // 이메일 검증
    (validEmailCheck(memMail)) 
        ? email = true 
        : email = false, $('.error-email').text($('.join-email-input').attr('data-un-valid-msg'));

    // 이름이 null이 아닌지 
    (!memName == '') 
        ? name = true 
        : name = false, $('.error-name').text($('.join-name-input').attr('data-un-valid-msg'));
    
    // 패스워드와 아래 패스워드가 일치하는지
    ($('#password').val() == $('#password2').val())
        ? checkpassword = true 
        : checkpassword = false, $('.error-pw2').text($('.js-join-password2').attr('data-un-valid-msg'));
    
    // 패스워드의 형식이 맞는지 체크
    (chkPW(memPw)) ? password = true : password = false;
    
    // 체크 박스가 체크 되었는지 
    ($('input:checkbox[id="joinConfirmCheck"]').is(":checked") == true)
        ? checkbox = true 
        : checkbox = false, $("br").remove('#brremove'), $('.js-error-text').removeClass('d-none');

    // 모든 검증에 통과하면 ajax 실행
    if (name == true && password == true && email == true && checkpassword == true && checkbox == true) {

        // 이메일 팝업창을 띄운다
        $('.temp-popup').addClass('flow-all-background-1')
        $('.flow-project-popup-6').removeClass('d-none')

        // 입력된 이메일에 9자리 인증 코드를 전송한다
        postEmailCodeAjax(memMail, memName, memPw);
    }

    // 에러 메시지 혹은 input 비우기
    (email) ? $('.error-email').text('') : $('#joinUserEmail').val('');
    (name) ? $('.error-name').text(''): $('.join-name-input').val('');
    (password) ? $('.error-pw').text(''):$('#password').val('');
    (checkpassword) ? $('.error-pw2').text(''):$('#password2').val('');
    if(checkbox) { 
        $('.js-error-text').addClass('d-none');
        $('.addbr').html('<br><br>')
    }
    else
        $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
})

// 인증 번호 치는 칸은 눌러도 팝업창이 닫히지 않게 설정
$('.auth-popup').on('click', function () {
    return false;
})

// 검은색 백그라운드를 눌러서 팝업 나가기
$('.flow-project-make-2').on('click', function () {
    $('.temp-popup').removeClass('flow-all-background-1')
    $('.flow-project-popup-6').addClass('d-none')
})
export function cleanFrom() {
    $('.join-name-input').val('');
    $('#password').val('')
    $('#password2').val('')
    $('.temp-popup').removeClass('flow-all-background-1')
    $('.flow-project-popup-6').addClass('d-none')
    $('.error-email').text($('.join-email-input').attr('data-exist-mail'));
    $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
    $('#authInput').val('')
}