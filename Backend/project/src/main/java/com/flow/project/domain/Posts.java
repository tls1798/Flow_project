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
    private int postWriter;
    private String postTitle;
    private String postContent;
    private String postDatetime;
    private String postName;
    private int postPin;
    private String rmTitle;
    private int postBookmark;
}
