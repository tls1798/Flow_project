package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectListData {

    private String rmNo;
    private String rmTitle;
    private String rmDes;
    private String rmAdmin;
    private int rmMemCount;
    private String favoriteProject;

    // favoriteProject getter (boolean 타입으로 반환하기 위함)
    public Boolean getFavoriteProject() {
        return favoriteProject != null;
    }
}
