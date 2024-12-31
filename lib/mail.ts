import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.AUTH_URL;

const generateEmailTemplate = (title: string, message: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <table style="w-full max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <tr>
        <td style="text-align: center;">
          <h2 style="color: #007bff;">${title}</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">
            <p>Hello,</p>
            ${message}
        </td>
      </tr>
      <tr>
        <td style="padding-top: 20px; text-align: center; color: #666;">
          <p>Thank you for using our service,<br>The Security Team</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const message = `
    <p>Your verification code to access your account is:</p>
    <p style="font-size: 24px; font-weight: bold; color: #007bff;">${token}</p>
    <p>This code is valid for the next 5 minutes. If you did not request this code, please ignore this email.</p>
  `;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: generateEmailTemplate("Your 2FA Verification Code", message),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const message = `<p>Please reset your password by <a href="${confirmLink}">clicking here</a>.`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: generateEmailTemplate("Reset your password", message),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const message = `<p>Please confirm your account by <a href="${confirmLink}">clicking here</a>.`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: generateEmailTemplate("Confirm your email", message),
  });
};
