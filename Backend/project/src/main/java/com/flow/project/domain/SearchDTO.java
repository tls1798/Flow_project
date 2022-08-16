package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class SearchDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CmPostSearchDTO {
        private int cmNo;
        private int postNo;
        private String searchContent;
        private String searchWriter;
        private String searchDatetime;
        private String rmNo;
        private String rmTitle;
    }

    @Data
    public static class RoomSearchDTO{
        private String rmNo;
        private String rmTitle;
        private String favoriteProject;

        // favoriteProject getter (boolean 타입으로 반환하기 위함)
        public Boolean getFavoriteProject() {
            return favoriteProject != null;
        }
    }
}
