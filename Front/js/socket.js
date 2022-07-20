$(function () {
    var socket = io.connect('http://localhost:3000');
    let memNo = window.localStorage.getItem('memNo');
    socket.emit('memNo', memNo);

    socket.on('data', function (rows) {
        let row = rows;
        $('#alarmUl').html('');

        for (row of row) {
            let name = row.mem_name;
            let title = row.rm_title;
            let time = row.nt_datetime;
            let content = row.noti_content;
            let count = row.count;
            let roomnum = row.rm_no;
            let postnum = row.nt_detail_no;
            
            $('#leftProjectHomeCount').text(count);
            $('#alarmTopCount').text(count);
        
            // 읽음 여부
            var checkedHTML;
            if (row.nt_temp['13'] == null)
                checkedHTML = `<li class="js-alarm-item on" data-rn-id=` + roomnum + ` data-pn-id =` + postnum + `>`;
            else
                checkedHTML = `<li class="js-alarm-item alarm-read d-none " data-rn-id=` + roomnum + ` data-pn-id=` + postnum + `>`;

            // 알림 종류에 따른 문구
            var desHTML;
            var contentHTML = `<div class="all-text-wrap-type-3">` + content + `</div>`;
            if (row.nt_type_no == 1)
                desHTML = `님의 글 등록`;
            else if (row.nt_type_no == 2)
                desHTML = `님의 댓글 등록`;
            else {
                desHTML = `님이 초대합니다`;
                contentHTML = ``;
            }

            $('#alarmUl').append(
                checkedHTML + `   
                    <div class="all-setup-picture-type-1"
                        style="background-image:url(https://flow.team/flow-renewal/assets/images/profile-default.png), url(https://flow.team/flow-renewal/assets/images/profile-default.png)"></div>
                    <div class="all-text-wrap-type-1">
                        <div class="all-setup-section-type-1">
                            <span>`+ title + `</span><em>` + time + `</em>
                        </div>
                        <div class="all-text-wrap-type-2 alarm-tit-ellipsis">`+ name + desHTML + `</div>
                        `+ contentHTML + `
                    </div>
                </li>
            `);
        }

        if ($('.js-read').hasClass('on')) {
            $('.js-read').click();
        }
    })
})