import nodemailer from "nodemailer";

import { escapeHtml } from "@/lib/escape";
import { getSettings } from "@/lib/settings";

export async function createTransporter() {
  const settings = await getSettings();

  if (!settings.smtp_host) return null;

  return nodemailer.createTransport({
    host: settings.smtp_host,
    port: parseInt(settings.smtp_port || "587", 10),
    secure: parseInt(settings.smtp_port || "587", 10) === 465,
    auth: {
      user: settings.smtp_user || "",
      pass: settings.smtp_pass || "",
    },
  });
}

export async function sendNotificationEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const settings = await getSettings();
  const to = settings.notification_email;

  if (!to) return;

  const transporter = await createTransporter();
  if (!transporter) return;

  const html = `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Subject:</td><td style="padding:8px;">${escapeHtml(subject)}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
    <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
    <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
    <p style="font-size:12px;color:#888;">
      Sent from <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}">My True Siblings</a> contact form.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: settings.smtp_from || settings.smtp_user || email,
      to,
      subject: `[Contact Form] ${subject}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const settings = await getSettings();
  const transporter = await createTransporter();
  if (!transporter) return;

  const from = settings.smtp_from || settings.smtp_user;
  if (!from) return;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2>Admin Password Reset</h2>
      <p>You requested a password reset for the admin panel.</p>
      <p style="margin:24px 0;">
        <a href="${resetLink}" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
      </p>
      <p style="font-size:12px;color:#888;">
        If you didn't request this, you can safely ignore this email.<br/>
        This link expires in 1 hour.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Admin Password Reset - My True Siblings",
      html,
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }
}

export async function sendTestEmail(to: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    return { success: false, error: "SMTP not configured. Fill in the SMTP fields first." };
  }

  const settings = await getSettings();
  const from = settings.smtp_from || settings.smtp_user;

  if (!from) {
    return { success: false, error: "SMTP User or From Address is required." };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: "Test Email from My True Siblings Admin",
      html: "<p>This is a test email. Your SMTP settings are working correctly.</p>",
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
