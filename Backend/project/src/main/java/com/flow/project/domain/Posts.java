package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Posts {

    private int postNo;
    private String rmNo;
    private String postWriter;
    private String postTitle;
    private String postContent;
    private String postDatetime;
    private String postEditDatetime;
    private String postName;
    private int postPin;
    private String rmTitle;
    private String rmAdmin;
    private int postBookmark;
    private int postReadCount;
}
