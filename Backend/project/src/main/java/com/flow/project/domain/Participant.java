package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {

    private String rmNo;
    private String memNo;
    private String rmAdmin;
    private String adminName;
    private String memName;
}
