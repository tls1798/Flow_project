$(function(){
    // 프로젝트 리스트 업데이트 함수
    const updateProjectList = function () {
        let accessToken= window.localStorage.getItem('accessToken');
        let memNo= window.localStorage.getItem('memNo');
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/members/'+memNo+'/rooms',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {      
                xhr.setRequestHeader("token",accessToken);
               },
            success: function (result, status, xhr) {
                for(var i=0; i<result.length; i++){
                    // 즐겨찾는 프로젝트
                    if(result[i].favoriteProject==true){
                        $('#MyStarProject').append(`
                            <li class="project-item ui-state-default" data-id="`+result[i].rmNo+`">
                                <a class="cursor-pointer">
                                    <!-- 알림 배지 -->
                                    <div class="flow-content-ct project-badge" style="display:none"></div>
                                    <!-- 좌측 컬러 -->
                                    <div class="color-code left-menu-type-1 color-code-1"></div>
                                    <div class="left-menu-type-con">
                                        <div class="project-star flow-content-star"></div>
                                        <div class="flow-content-txt project-ttl">`+result[i].rmTitle+`</div>
                                        <div class="flow-content-b-c" style="display:block">
                                            <div class="flow-content-hm-txt"><i class="bi bi-person"></i></div>
                                            <span class="member-cnt">`+result[i].rmMemCount+`</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        `);
                    }
                    // 참여중 프로젝트
                    else {
                        $('#MyProject').append(`
                            <li class="project-item ui-state-default" data-id="`+result[i].rmNo+`">
                                <a class="cursor-pointer">
                                    <!-- 알림 배지 -->
                                    <div class="flow-content-ct project-badge" style="display:none"></div>
                                    <!-- 좌측 컬러 -->
                                    <div class="color-code left-menu-type-1 color-code-1"></div>
                                    <div class="left-menu-type-con">
                                        <div class="project-star flow-content-star flow-content-star-un"></div>
                                        <div class="flow-content-txt project-ttl">`+result[i].rmTitle+`</div>
                                        <div class="flow-content-b-c" style="display:block">
                                            <div class="flow-content-hm-txt"><i class="bi bi-person"></i></div>
                                            <span class="member-cnt">`+result[i].rmMemCount+`</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        `);
                    }
                }

                // 즐겨찾기, 참여중 프로젝트 div display 수정
                if($('#MyStarProject').find('li').length!=0)
                    $('#MyStarProject').css('display', 'block');
                else
                    $('#MyStarProject').css('display', 'none');
                if($('#MyProject').find('li').length!=0)
                    $('#MyProject').css('display', 'block');
                else
                    $('#MyProject').css('display', 'none');
            },
            error: function (xhr, status, err) {
                let refreshToken = window.localStorage.getItem('refreshToken');
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/auth/get-newToken',
                    data: JSON.stringify({ refreshToken:refreshToken}),
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

    // 프로젝트 리스트 초기화 및 업데이트 함수
    const clearAndUpdate = function() {
        // 초기화
        $('#projectBoardUl').find('li').remove();
        // 프로젝트 리스트 업데이트
        updateProjectList();
    }

    // 불러올 때 프로젝트 리스트 초기화 및 업데이트
    clearAndUpdate();

    // 즐겨찾기 별 클릭
    $(document).on('click', '.flow-content-star', function(e){

        // 현재 선택한 프로젝트 인덱스
        var rmNo = $(this).parents('.project-item').attr('data-id');

        // 즐겨찾기 해제 상태일 때 -> 즐겨찾기 등록
        if($(e.target).hasClass('flow-content-star-un')){

            // star 이미지 교체를 위한 removeClass
            $(e.target).removeClass('flow-content-star-un');

            // 비동기 통신
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/favorites',
                data: JSON.stringify({"rmNo": rmNo, "memNo": 13}),
                contentType: 'application/json; charset=utf-8',
                success: function (result, status, xhr) {
                    clearAndUpdate();
                },
                error: function (xhr, status, err) {}
            });
        }

        // 즐겨찾는 프로젝트 일 때 -> 즐겨찾기 취소
        else{

            // star 이미지 교체를 위한 addClass
            $(e.target).addClass('flow-content-star-un');

            // 비동기 통신
            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/api/favorites',
                data: JSON.stringify({"rmNo": rmNo, "memNo": 13}),
                contentType: 'application/json; charset=utf-8',
                success: function (result, status, xhr) {
                    clearAndUpdate();
                },
                error: function (xhr, status, err) {}
            });
        }
    })
})