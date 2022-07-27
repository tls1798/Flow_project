package com.flow.project.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Bookmark {
    private int memNo;
    private int postNo;

    @Getter
    @Setter
    public static class BookmarkDTO{
        private String postTitle;
        private String rmTitle;
        private String memName;
        private String postDatetime;
        private int CmCount;
        private int memNo;
        private int postNo;

    }
}
