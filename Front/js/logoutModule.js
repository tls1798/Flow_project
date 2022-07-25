import {autoaccess} from './autoAccess.js'
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
            window.localStorage.setItem('memNo', '-1');
            location.href = 'home.html'
        },
        error: function (xhr, status, err) { 
            autoaccess()
        }
    });
}

export default function logout() {
   return logoutFunction();
    
}