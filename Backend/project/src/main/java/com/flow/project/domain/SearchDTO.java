package com.flow.project.domain;

import lombok.Getter;
import lombok.Setter;

public class SearchDTO {
    @Getter
    @Setter
    public static class CmSearchDTO{
        private int cmNo;
        private String cmContent;
        private String cmWriter;
        private String rmTitle;
        private String cmDatetime;
        private String rmNo;
    }
    @Getter
    @Setter
    public static class PostSearchDTO{
        private int postNo;
        private String postTitle;
        private String rmTitle;
        private String postWriter;
        private String postDatetime;
        private String rmNo;
    }
    @Getter
    @Setter
    public static class RoomSearchDTO{
        private String rmNo;
        private String rmTitle;
    }
}
