$(function(){
    let accessToken= window.localStorage.getItem('accessToken');
    let memNo= window.localStorage.getItem('memNo');

    $(document).on('click', '.project-item', function(e){

        // 즐겨찾기 버튼 클릭 시 프로젝트 선택X
        if($(e.target).hasClass('flow-content-star')){
            return false;
        }
        
        $('#mainTop').css('display','none');
        $('#detailTop').css('display','block');
        $('#projectHomeLayer').css('display','none');
        $('#detailLayer').css('display','block');

        // 프로젝트 관리자/참여자 별 디테일 메뉴 다르게 보이도록
        getRoom($(this).attr('data-id'));
    })

    // 사이드바의 메뉴, 프로젝트 카드, 로고 클릭 시 사이드바 메뉴 active 해제 (this 제외)
    $('.left-menu-item, .project-item, .logo-box').click(function(e){
        $('.left-menu-item').not(this).removeClass('flow-active');
        
        // 만약 로고 클릭 시, 내 프로젝트 active
        if($(this).hasClass('logo-box')){
            $('.left-menu-main').addClass('flow-active');
        }
    });

    // 프로젝트 방 조회
    const getRoom = function(rmNo){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/rooms/'+rmNo,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
            },
            success: function (result, status, xhr) {
                // 내가 관리자일 경우
                if(result.rmAdmin==memNo){
                    $('#detailSettingProjectExitBtn').css('display', 'none');
                    $('#detailSettingProjectUpdateBtn').css('display', 'block');
                    $('#detailSettingProjectDeleteBtn').css('display', 'block');
                }
                // 참여자일 경우
                else{
                    $('#detailSettingProjectExitBtn').css('display', 'block');
                    $('#detailSettingProjectUpdateBtn').css('display', 'none');
                    $('#detailSettingProjectDeleteBtn').css('display', 'none');
                }
            },
            error: function (xhr, status, err) {
                let accessToken = window.localStorage.getItem('accessToken');
                let refreshToken = window.localStorage.getItem('refreshToken');
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/auth/get-newToken',
                    data: JSON.stringify({
                        accessToken:accessToken,
                        refreshToken: refreshToken
                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (result, status, xhr) {
                        let accessToken = result.accessToken;
                        window.localStorage.setItem('accessToken', accessToken);                     
                    },
                    error: function (xhr, status, err) { 
                        alert('로그인을 다시 해주세요');
                         location.href = 'login.html'
                    }
                });
            }
        });
    }
})