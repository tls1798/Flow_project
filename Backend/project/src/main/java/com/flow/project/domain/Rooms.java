package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rooms {

    private int rmNo;
    private String rmTitle;
    private String rmDes;
    private int rmAdmin;
}
