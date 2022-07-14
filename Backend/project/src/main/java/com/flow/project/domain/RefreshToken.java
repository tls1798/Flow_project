package com.flow.project.domain;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefreshToken {

    private long idx;
    private String userEmail;
    private long memNo;
    private String refreshToken;
}
