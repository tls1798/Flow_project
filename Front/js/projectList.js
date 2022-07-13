$(function(){
    $(document).on('click', '.flow-content-star', function(e){
        // 즐겨찾기 해제 상태일 때
        if($(e.target).hasClass('flow-content-star-un'))
            $(e.target).removeClass('flow-content-star-un');
        else
            $(e.target).addClass('flow-content-star-un');
    })

    // 프로젝트 리스트 업데이트 함수
    const updateProjectList = function(){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/members/13/rooms',
            contentType: 'application/json; charset=utf-8',
            success: function (result, status, xhr) {
                for(var i=0; i<result.length; i++){
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
            },
            error: function (xhr, status, err) {}
        });
    }

    // 프로젝트 리스트 업데이트
    updateProjectList();
})