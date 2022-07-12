package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Posts {
    private int postNo, rmNo, postWriter;
    private String postTitle, postContent;
    private Date postDatetime;
}
