const selectMember = function(memNo){

    let accessToken= window.localStorage.getItem('accessToken');
    var res;

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/member/'+memNo,
        contentType: 'application/json; charset=utf-8',
        async: false,
        beforeSend: function (xhr) {      
            xhr.setRequestHeader("token",accessToken);
        },
        success: function (result, status, xhr) {
            res = result;
        },
        error: function (xhr, status, err) {}
    });

    return res;
};

export default function getMemberInfo(memNo){
    return selectMember(memNo);
}