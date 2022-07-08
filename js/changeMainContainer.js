$(function () {
    $('.project-item').click(function () {
        $('#mainTop').css('display', 'none');
        $('#detailTop').css('display', 'block');
        $('#projectHomeLayer').css('display', 'none');
        $('#feedContainer').css('display', 'flex');
    })
})