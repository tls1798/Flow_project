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
    private int rmMemCount;
    private String favoriteProject;
}
