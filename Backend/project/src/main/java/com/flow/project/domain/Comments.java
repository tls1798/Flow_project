package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comments {
    private int cmNo, postNo, cmWriter;
    private String cmContent;
    private Date cmDatetime;
}
