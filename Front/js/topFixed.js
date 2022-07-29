import updateRight from '../js/rightPostCard.js';
// 상단고정 클릭 시
$(document).on('click','#pinPostUl',function(e){
    let rmNo; 
    let postNo; 
    new Promise((succ, fail)=>{
        rmNo = $(e.target).closest('li').attr('data-project-srno');
        postNo = $(e.target).closest('li').attr('data-post-srno');
        succ(rmNo, postNo);
    }).then((arg)=>{
        updateRight(rmNo, postNo);
    })
})