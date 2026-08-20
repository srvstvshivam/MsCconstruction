package com.msconstruction.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

/**
 * Sends HTML email notifications via the configured Gmail SMTP account.
 * Called whenever a visitor submits the contact form, so the owner is
 * notified immediately without having to check the admin dashboard.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${app.admin.notification-email}")
    private String notificationEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an HTML notification email to the owner when a new contact query arrives.
     *
     * @param name    visitor's name
     * @param email   visitor's email
     * @param phone   visitor's phone (may be null)
     * @param message the query message
     */
    public void sendNewQueryNotification(String name, String email, String phone, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(notificationEmail);
            helper.setSubject("📬 New Contact Query — MS Construction Website");

            String html = """
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                      <div style="background:#1e3a5f;padding:24px 32px;">
                        <h1 style="color:#f59e0b;margin:0;font-size:20px;">MS Construction</h1>
                        <p style="color:#cbd5e1;margin:4px 0 0;font-size:13px;">New contact query received</p>
                      </div>
                      <div style="padding:32px;">
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                          <tr>
                            <td style="padding:8px 0;color:#64748b;width:100px;">Name</td>
                            <td style="padding:8px 0;font-weight:600;color:#1e293b;">%s</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#64748b;">Email</td>
                            <td style="padding:8px 0;color:#1e293b;"><a href="mailto:%s" style="color:#f59e0b;">%s</a></td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#64748b;">Phone</td>
                            <td style="padding:8px 0;color:#1e293b;">%s</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#64748b;vertical-align:top;">Message</td>
                            <td style="padding:8px 0;color:#1e293b;">%s</td>
                          </tr>
                        </table>
                        <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:6px;font-size:13px;color:#64748b;">
                          Log in to the admin dashboard to mark this query as read or reply directly.
                        </div>
                      </div>
                    </div>
                    """.formatted(
                    name,
                    email, email,
                    phone != null ? phone : "—",
                    message.replace("\n", "<br/>")
            );

            helper.setText(html, true);
            mailSender.send(mimeMessage);

        } catch (Exception ex) {
            // Log but don't fail the user-facing request if email sending fails
            System.err.println("[EmailService] Failed to send notification email: " + ex.getMessage());
        }
    }

    public void sendReplyEmail(String toEmail, String subject, String bodyMessage) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            String html = """
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                      <div style="padding:32px;color:#1e293b;font-size:15px;line-height:1.6;">
                        %s
                      </div>
                      <div style="background:#f8fafc;padding:16px 32px;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">
                        This email is from MS Construction. Please do not reply directly to this automated email address if it is unmonitored.
                      </div>
                    </div>
                    """.formatted(bodyMessage.replace("\n", "<br/>"));

            helper.setText(html, true);
            mailSender.send(mimeMessage);

        } catch (Exception ex) {
            System.err.println("[EmailService] Failed to send reply email: " + ex.getMessage());
            throw new RuntimeException("Failed to send email");
        }
    }
}
