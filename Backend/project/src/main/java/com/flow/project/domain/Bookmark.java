package com.flow.project.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Bookmark {
    private String memNo;
    private int postNo;

    @Getter
    @Setter
    public static class BookmarkDTO{
        private String postTitle;
        private String rmTitle;
        private String memName;
        private String postDatetime;
        private String rmNo;
        private String postContent;
        private int CmCount;
        private String memNo;
        private int postNo;
    }
}
