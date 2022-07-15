package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {

    private String rmNo;
    private int memNo;
    private int rmAdmin;
    private String adminName;
    private String memName;
}
