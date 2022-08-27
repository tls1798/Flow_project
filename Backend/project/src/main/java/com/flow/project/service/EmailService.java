package com.flow.project.service;

import com.flow.project.domain.Members;
import com.flow.project.handler.ErrorCode;
import com.flow.project.handler.UserException;
import com.flow.project.repository.AuthMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender emailSender;
    private final AuthMapper authMapper;
    private String ePw;

    // 메세지 객체를 생성해서 메일 제목 내용을 설정한다
    private MimeMessage createMessage(String to, int num) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = emailSender.createMimeMessage();
        String title1 = "Flow 회원가입 이메일 인증";
        String title2 = "Flow 비밀번호 재발급";
        String msg1 = "인증번호 입력창에 아래 인증번호를 입력하세요.";
        String msg2 = "새로 발급된 패스워드 입니다";
        String content1 = "\t\t\t\t\t\t\t\t본 메일은 ‘플로우’ 시작 시, 본인<br>\t\t\t\t\t\t\t\t확인을 위해 자동으로 발송되는 메일입니다.";
        String content2 = "\t\t\t\t\t\t\t\t본 메일은 ‘플로우’ 비밀번호 재발급시, 발송되는 메일입니다.";
        message.addRecipients(RecipientType.TO, to);//보내는 대상
        message.setSubject((num == 1) ? title1 : title2);//제목

        String msgg = "";
        msgg += "<table cellpadding=\"0\" cellspacing=\"0\" width=\"360px\" height=\"640px\" style=\"min-width:360px;max-width:700px;height:640px;margin:0;padding:0;background-color:#ffffff;\" bgcolor=\"#ffffff\">\t\n" +
                "        <tbody>\n" +
                "            <tr>\n" +
                "                <td align=\"left\" valign=\"top\" style=\"margin:0;padding:45px 30px 15px 15px;vertical-align:top;text-align:left;font-family:'MalgunGothic','맑은 고딕','Malgun Gothic','돋움',Dotum,'굴림',Gulim,Arial,sans-serif;\">\t\t\n" +
                "                    \t<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin:0;padding:0;border-collapse:collapse;border-spacing:0;width:100%;table-layout:fixed;\">\t\t\t\t<tbody><tr><td align=\"left\" valign=\"top\" style=\"margin:0;padding:15px 0 25px 0;vertical-align:top;border-top:1px solid #dee0e2;border-bottom:1px solid #dee0e2;\">\t\t\t\t\t\t\t<p style=\"margin:0;padding:0;font-size:14px;color:#111111;font-weight:normal;line-height:22px;text-align:left;font-family:'MalgunGothic','맑은 고딕','Malgun Gothic','돋움',Dotum,'굴림',Gulim,Arial,sans-serif;\">";
        msgg += (num == 1) ? content1 : content2 +
                "<br></p>\t\t\t\t\t\t\t<p style=\"margin:0;padding:0;font-size:14px;color:#111111;font-weight:normal;line-height:36px;text-align:left;font-family:'MalgunGothic','맑은 고딕','Malgun Gothic','돋움',Dotum,'굴림',Gulim,Arial,sans-serif;\"><b style=\"letter-spacing:-0.5px;\">";
        msgg += (num == 1) ? msg1 : msg2;
        msgg += "</b></p>\t\t\t\t\t\t\t<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" height=\"50px\" style=\"margin:15px 0 0 0;padding:0;border-collapse:collapse;border-spacing:0;width:100%;height:50px;table-layout:fixed;\">\t\t\t\t\t\t\t\t<tbody><tr><td align=\"center\" valign=\"middle\" width=\"280px\" height=\"50px\" style=\"margin:0;padding:0;vertical-align:middle;width:280px;height:50px;font-size:20px;color:#111111;font-weight:bold;text-align:center;font-family:'MalgunGothic','맑은 고딕','Malgun Gothic','돋움',Dotum,'굴림',Gulim,Arial,sans-serif;background-color:#eeeff0;\">" + ePw + "</td></tr></tbody>\t\t\t\t\t\t\t</table>\t\t\t\t\t\t</td></tr><tr><td align=\"left\" valign=\"top\" style=\"margin:0;padding:15px 0 18px 0;vertical-align:top;\">\t\t\t\t\t\t\t<p style=\"margin:0;padding:0;font-size:13px;color:#808284;font-weight:normal;line-height:22px;text-align:left;font-family:'MalgunGothic','맑은 고딕','Malgun Gothic','돋움',Dotum,'굴림',Gulim,Arial,sans-serif;\">\t\t\t\t\t\t\t\t\t\t\t</td></tr></tbody>\t\t\t</table>\t\t</td></tr></tbody></table>\n";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("wjdckdcjd@gmail.com", "noreply@flow.team"));//보내는 사람

        return message;
    }
    // 인증 코드 8 자리 생성 , 임시 패스워드
    public static String createKey() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) { // 인증코드 8자리
            int index = rnd.nextInt(3); // 0~2 까지 랜덤

            switch (index) {
                case 0:
                    key.append((char) ((int) (rnd.nextInt(26)) + 97));
                    //  a~z  (ex. 1+97=98 => (char)98 = 'b')
                    break;
                case 1:
                    key.append((char) ((int) (rnd.nextInt(26)) + 65));
                    //  A~Z
                    break;
                case 2:
                    key.append((rnd.nextInt(10)));
                    // 0~9
                    break;
            }
        }
        return key.toString();
    }
    // 이메일 발송 num 1이면 회원가입 2이면 비밀번호 재발급
    public Map<String, Object> sendSimpleMessage(String to, int num) throws Exception {
        Map<String, Object> result = new HashMap<>();
        Members member = new Members();
        ePw = createKey()+"!";
        // TODO Auto-generated method stub
        MimeMessage message = createMessage(to, num);
        try {//예외처리
            // 1이면 회원가입 이메일 발송
            if (num == 1)
                result.put("ePw", ePw);
                // num이 1이 아닐경우 패스워드 재설정후 이메일 발송
            else {
                member.setMemMail(to);
                String newPw = passwordEncoder.encode(ePw);
                member.setMemPw(newPw);
                if (authMapper.newPassword(member) > 0)
                    System.out.println("success");
                else {
                    throw new UserException(ErrorCode.FailPwException);
                }
            }
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new UserException(ErrorCode.FailMessageException);
        }
        return result;
    }

}
