package com.flow.project.domain;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefreshToken {

    private long idx;
    private String memNo;
    private String refreshToken;
}
