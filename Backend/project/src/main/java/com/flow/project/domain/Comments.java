package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comments {

    private int cmNo;
    private int postNo;
    private int cmWriter;
    private String cmContent;
    private String cmDatetime;
    private String cmEditDatetime;
    private String cmName;
}
