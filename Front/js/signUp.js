// 모든 input 비우기
function cleanFrom() {
    $('#joinUserEmail').val('')
    $('.join-name-input').val('');
    $('#password').val('')
    $('#password2').val('')
    $('.temp-popup').removeClass('flow-all-background-1')
    $('.flow-project-popup-6').addClass('d-none')
    $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
    $('#authInput').val('')
}

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
        $('.error-pw').text($('.js-join-password').attr('data-length-msg')), $('.js-join-password').addClass('input-error')
        return false;
    } else if (pw.search(/\s/) != -1) {
        $('.error-pw').text($('.js-join-password').attr('data-empty-msg')), $('.js-join-password').addClass('input-error')
        return false;
    } else if (num < 0 || eng < 0 || spe < 0) {
        $('.error-pw').text($('.js-join-password').attr('data-un-valid-msg')), $('.js-join-password').addClass('input-error')
        return false;
    } else {
        return true;
    }
}

// err 메세지, err class 제거
function cleanIdinput() {
    $('.error-email').text(''), $('#joinUserEmail').removeClass('input-error');
}
function cleanNameInput() {
    $('.error-name').text(''), $('#joinUserName').removeClass('input-error')
}
function cleanPwInput() {
    $('.error-pw').text(''), $('.js-join-password').removeClass('input-error')
}
function cleanPw2Input() {
    $('.error-pw2').text(''), $('.js-join-password2').removeClass('input-error');
}
function cleanChkbox() {
    $('.js-error-text').addClass('d-none'), $('.addbr').html('<br><br>');
}

// 포커스 되면 비우기
$('#joinUserEmail').focusin(function () { cleanIdinput() })
$('#joinUserName').focusin(function () { cleanNameInput() })
$('.js-join-password').focusin(function () { cleanPwInput() })
$('.js-join-password2').focusin(function () { cleanPw2Input() })
$('.js-confirm-check').on('click', function () { cleanChkbox() })

let existmail = false;
// 가입된 이메일인지 확인
$('#joinUserEmail').focusout(function () {
    let memMail = $('#joinUserEmail').val();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8818/api/auth/email/' + memMail,
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            if (result != '') {
                $('.error-email').text($('.join-email-input').attr('data-exist-mail'));
                $('#joinUserEmail').addClass('input-error')
            }
            else {
                $('.error-email').text('')
                $('#joinUserEmail').removeClass('input-error')
                existmail = true;
            }
        },
        error: function (xhr, status, err) { }
    });
})
// 인증번호
let epw;
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
        : email = false, $('.error-email').text($('.join-email-input').attr('data-un-valid-msg')), $('#joinUserEmail').addClass('input-error');

    // 이름이 null이 아닌지 
    (!memName == '')
        ? name = true
        : name = false, $('.error-name').text($('.join-name-input').attr('data-un-valid-msg')), $('#joinUserName').addClass('input-error');

    // 패스워드와 아래 패스워드가 일치하는지
    ($('#password').val() == $('#password2').val())
        ? checkpassword = true
        : checkpassword = false, $('.error-pw2').text($('.js-join-password2').attr('data-un-valid-msg')), $('.js-join-password2').addClass('input-error');

    // 패스워드의 형식이 맞는지 체크
    (chkPW(memPw)) ? password = true : password = false;

    // 체크 박스가 체크 되었는지 
    ($('input:checkbox[id="joinConfirmCheck"]').is(":checked") == true)
        ? checkbox = true
        : checkbox = false, $("br").remove('#brremove'), $('.js-error-text').removeClass('d-none');

    // 모든 검증에 통과하면 ajax 실행
    if (name == true && password == true && email == true && checkpassword == true && checkbox == true && existmail == true) {
        // 이메일 팝업창을 띄운다
        $('.temp-popup').addClass('flow-all-background-1')
        $('.flow-project-popup-6').removeClass('d-none')

        // 입력된 이메일에 9자리 인증 코드를 전송한다
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8818/api/auth/email',
            data: JSON.stringify({
                "memMail": memMail
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {
                // 이메일 전송이 완료되면 9자리 코드를 return 받는다
                epw = result.ePw

                $('.confirm-button').on('click', function () {
                    let num = $('#authInput').val();
                    // 사용자가 입력한 인증 코드와 생성한 인증코드 일치하는지 확인
                    if (num == epw) {
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8818/api/auth/members/new',
                            data: JSON.stringify({
                                memMail: memMail,
                                memName: memName,
                                memPw: memPw
                            }),
                            contentType: 'application/json; charset=utf-8',
                            success: function (result, status, xhr) {
                                location.href = './login.html'
                                existmail = false;
                            },
                            error: function (xhr, status, err) {
                                cleanFrom()
                                $('.error-email').text($('.join-email-input').attr('data-exist-mail'));
                                $('#joinUserEmail').addClass('input-error')
                            }
                        });
                    } else {
                        $('#authInput').val('')
                        $('.error-email').text($('.join-email-input').attr('data-incorrect-code'));
                        $('#joinUserEmail').addClass('input-error')
                    }
                })
            },
            error: function (xhr, status, err) { }
        });
    }

    // 에러 메시지 혹은 input 비우기
    (email) ? cleanIdinput() : $('#joinUserEmail').val('');
    (name) ? cleanNameInput() : $('.join-name-input').val('');
    (password) ? cleanPwInput() : $('#password').val('');
    (checkpassword) ? cleanPw2Input() : $('#password2').val('');
    (checkbox) ? cleanChkbox() : $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
})

// 인증 번호 치는 칸은 눌러도 팝업창이 닫히지 않게 설정
$('.auth-popup').on('click', function () {
    return false;
})

// 검은색 백그라운드를 눌러서 팝업 나가기
$('.flow-project-make-2').on('click', function () {
    $('#tempPopup').removeClass('flow-all-background-1')
    $('.flow-project-popup-6').addClass('d-none')
})