$(function(){
        // 모달, 팝업 display:none -> false, block -> true
        var profileModalBool = false;
        var searchPopupBool = false;

        // 프로필 사진 클릭 시 프로필 모달 띄우기
        $(".btn-profile").click(function(){
            if(!profileModalBool){
                $(this).addClass('active');
                $(".modal-account").css('display', 'block');
                profileModalBool=!profileModalBool;

                // html.click 동작시키지 않기 위해 작성
                return false;
            }
        });

        // 검색창 클릭 시 검색 팝업 띄우기
        $(".main-search").click(function(){
            if(!searchPopupBool){
                $(".name-type-seach-popup").css('display', 'block');
                searchPopupBool=!searchPopupBool;

                // html.click 동작시키지 않기 위해 작성
                return false;
            }
        });

        
        $('html').click(function(e) {
            // 어디든 클릭하면 프로필 모달 display none
            if(profileModalBool) {
                $(this).removeClass('active');
                $(".modal-account").css('display', 'none');
                profileModalBool=!profileModalBool;
            }

            // 검색창 팝업 display none (검색창 팝업 클릭할 시엔 X)
            if(searchPopupBool && !$(e.target).hasClass('search-popup')) {
                $(".name-type-seach-popup").css('display', 'none');
                searchPopupBool=!searchPopupBool;
            }
        });

        // tooltip
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(
            tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
        );
        $('[data-toggle="tooltip"]').tooltip({
            trigger : 'hover'
        })
});