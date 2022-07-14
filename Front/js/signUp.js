$(function () {
    $('#teamStepButton').on('click', function () {
    
        if ($('#password').val() == $('#password2').val()) {
            if ($('input:checkbox[id="joinConfirmCheck"]').is(":checked") == true) {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/auth/members/new',
                    data: JSON.stringify({
                        memMail: $('#joinUserEmail').val(),
                        memName: $('#joinUserName').val(),
                        memPw: $('#password').val()
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
            } else {
                alert('서비스 이용약관을 체크해주세요')
            }
        } else  {
            alert('비밀번호가 일치하지 않습니다')
            $('#password').val('');
            $('#password2').val('');
            $('input:checkbox[id="joinConfirmCheck"]').prop('checked', false);
        }
      
})
})