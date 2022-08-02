import {addCommentAjax, editCommentAjax, removeCommentAjax} from './ajax.js'

// Date format
Date.prototype.YYYYMMDDHHMMSS = function () {
    var yyyy = this.getFullYear().toString();
    var MM = pad(this.getMonth() + 1, 2);
    var dd = pad(this.getDate(), 2);
    var hh = pad(this.getHours(), 2);
    var mm = pad(this.getMinutes(), 2)

    return yyyy+'-'+MM+'-'+dd+' '+hh+':'+mm;
};
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

//  엔터 시 줄 바꿈 막기
$(document).on('keydown','.comment-input, .edit-comment-input',function(key){      
    if(key.keyCode==13){
        if(!key.shiftKey){
            key.preventDefault();
        }
    }
})

// shift+enter 줄 바꿈, 엔터 시 입력
$(document).on('keyup','.comment-input',function(key){      
    if(key.keyCode == 13 && !key.shiftKey){
        key.preventDefault();

        let rmNo= $(this).closest('li').attr('data-project-srno');
        let postNo= $(this).closest('li').attr('data-post-srno');
        let cmContent = this.innerText.trim();

        // shift+enter -> 줄바꿈을 <br>로 바꾸어 db에 저장
        cmContent = cmContent.replace(/(\n|\r\n)/g, '<br>');

        let cmNo = 0;
        let ntTemp ='{';
        addCommentAjax(key, rmNo, postNo, cmContent, ntTemp, cmNo);
    }
})

let cmNo;
$(document).on('click', '.comment-writer-menu',function(e){
    
    // 댓글 수정
    if(e.target.id=='cmEditBtn'){
        let cmContent = $(this).closest('.comment-container').find('.comment-text div').html();
        cmNo = $(this).closest('li').attr('remark-srno');
        $(this).closest('.comment-container').removeClass('on');
        $(this).closest('.comment-container').next().addClass('on');
        // 줄바꿈을 포함하여 div에 들어가도록 수정해야 함
        $(this).closest('.comment-container').next().find('.edit-comment-input').text(cmContent);

        // shift+enter 줄 바꿈, 엔터 시 입력
        $(document).on('keyup', '.edit-comment-input', function (key) {
            if(key.keyCode == 13 && !key.shiftKey){
                key.preventDefault();

                let postNo= $(this).closest('[id^="post"]').attr('data-post-srno');
                let cmContent = this.innerText.trim();

                // shift+enter -> 줄바꿈을 <br>로 바꾸어 db에 저장
                cmContent = cmContent.replace(/(\n|\r\n)/g, '<br>');
            
                editCommentAjax(postNo, cmContent, cmNo);
            }
        })
    }

    // 댓글 삭제
    else if(e.target.id=='cmDelBtn'){
        const postNo = $(this).closest('li').parent().closest('li').attr('data-post-srno');
        const cmNo = $(this).closest('li').attr('remark-srno');
        const myCm = $(this).parents('.remark-item');

        removeCommentAjax(e, postNo, cmNo, myCm);
    }
})