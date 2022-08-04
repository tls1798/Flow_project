// X 클릭 시, 창 닫고 topSettingBar 활성화
$('#searchResultClose').click(function(){
    $('#searchResult').addClass('d-none');
    $('.top-setting-bar #topSettingBar').css('display', 'block');
});