$(function () {
    $('#teamStepButton').on('click', function () {
        let memMail = $('#joinUserEmail').val();
        let memName = $('#joinUserName').val();
        let memPw = $('#password').val();
        $('.temp-popup').addClass('flow-all-background-1')
        $('.flow-project-popup-6').removeClass('d-none')
        console.log('1' + memMail)
        console.log($('#password').val())
        console.log($('#password2').val())
        if ($('#password').val() == $('#password2').val()) {

            if ($('input:checkbox[id="joinConfirmCheck"]').is(":checked") == true) {
                console.log('2' + memMail)
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/auth/emailConfirm',
                    data: JSON.stringify({
                        memMail: memMail
                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (result, status, xhr) {
                        let ePw = result.ePw;
                        window.localStorage.setItem('ePw', ePw);
                    },
                    error: function (xhr, status, err) {
                    }
                });
                $('.confirm-button').on('click', function () {
                    let num = $('#authInput').val();
                    let ePw = window.localStorage.getItem('ePw');
                    if (num == ePw) {
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8080/api/auth/members/new',
                            data: JSON.stringify({
                                memMail: memMail,
                                memName: memName,
                                memPw: memPw
                            }),
                            contentType: 'application/json; charset=utf-8',
                            success: function (result, status, xhr) {
                                $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);

                                location.href = 'login.html'
                            },
                            error: function (xhr, status, err) {
                                console.log(xhr.readyState)
                                console.log(xhr.status)
                                console.log(xhr.responseText)
                            }
                        });
                    }

                })
            } else {
                $('.temp-popup').removeClass('flow-all-background-1')
                $('.flow-project-popup-6').addClass('d-none')
                alert('checkbox 체크 ')
            }
        } else {
            alert('비밀번호가 일치하지 않습니다')
            $('.temp-popup').removeClass('flow-all-background-1')
            $('.flow-project-popup-6').addClass('d-none')
            $('#password').val('');
            $('#password2').val('');
            $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
        }
    })
})
