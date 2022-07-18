package com.flow.project.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import springfox.documentation.spring.web.json.Json;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notifications {
    private int ntNo;
    private int ntTypeNo;
    private int ntDetailNo;
    private int memNo;
    private Date ntDatetime;
    private String rmNo;
    private String memName;
    private String rmTitle;
    private String notiContent;
    private Json ntTemp;
}
