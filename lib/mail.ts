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
      from: settings.smtp_from || settings.smtp_user || 'noreply@mytruesiblingsinitiative.org',
      replyTo: email,
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

export async function sendMatchNotificationEmail(
  toEmail: string,
  toName: string,
  type: "match_found" | "match_accepted" | "match_declined",
  otherName: string
) {
  const settings = await getSettings();
  const transporter = await createTransporter();
  if (!transporter) return;

  const from = settings.smtp_from || settings.smtp_user;
  if (!from) return;

  const subjects: Record<string, string> = {
    match_found: "You have a new match on My True Siblings!",
    match_accepted: `${otherName} accepted your match request!`,
    match_declined: `Update on your match request`,
  };

  const bodies: Record<string, string> = {
    match_found: `<p>Great news, ${toName}!</p><p>A potential sibling match has been found for you. Log in to view the match details and decide if you'd like to connect.</p>`,
    match_accepted: `<p>Exciting news, ${toName}!</p><p><strong>${otherName}</strong> has accepted your match request. You can now start a conversation and build your sibling bond.</p>`,
    match_declined: `<p>Hi ${toName},</p><p>Unfortunately, <strong>${otherName}</strong> declined the match request. Don't worry — new matches are always being processed. Keep an eye on your account for updates.</p>`,
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#175550;">My True Siblings</h2>
      ${bodies[type]}
      <p style="margin:24px 0;">
        <a href="${siteUrl}/account/matches" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          View My Matches
        </a>
      </p>
      <p style="font-size:12px;color:#888;">
        You received this because you have an account on My True Siblings.<br/>
        <a href="${siteUrl}/account/settings">Manage notification preferences</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: subjects[type],
      html,
    });
  } catch (err) {
    console.error("Failed to send match notification email:", err);
  }
}

export async function sendMentorApprovalEmail(
  email: string,
  name: string,
  approved: boolean
) {
  const settings = await getSettings();
  const transporter = await createTransporter();
  if (!transporter) return;

  const from = settings.smtp_from || settings.smtp_user;
  if (!from) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (approved) {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#175550;">My True Siblings Initiative</h2>
        <p>Dear ${escapeHtml(name)},</p>
        <p><strong>Congratulations!</strong> Your mentor application has been approved. You can now log in and start mentoring siblings who need your guidance.</p>
        <p style="margin:24px 0;">
          <a href="${siteUrl}/login" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Log In to Your Account
          </a>
        </p>
        <p style="font-size:12px;color:#888;">
          If the button doesn't work, copy this link: ${siteUrl}/login
        </p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
        <p style="font-size:12px;color:#888;">My True Siblings Initiative</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: "Mentor Application Approved - My True Siblings Initiative",
        html,
      });
    } catch (err) {
      console.error("Failed to send mentor approval email:", err);
    }
  } else {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#175550;">My True Siblings Initiative</h2>
        <p>Dear ${escapeHtml(name)},</p>
        <p>Thank you for your interest in becoming a mentor with My True Siblings Initiative.</p>
        <p>After careful review, we regret to inform you that your mentor application was not approved at this time.</p>
        <p>This decision does not reflect your qualifications. We receive many applications and must prioritize based on current community needs. You are welcome to reapply in the future.</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
        <p style="font-size:12px;color:#888;">My True Siblings Initiative</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: "Update on Your Mentor Application - My True Siblings Initiative",
        html,
      });
    } catch (err) {
      console.error("Failed to send mentor rejection email:", err);
    }
  }
}

export async function sendNewMentorPendingEmail(
  mentorName: string,
  mentorEmail: string,
  occupation: string | null,
  organization: string | null
) {
  const settings = await getSettings();
  const to = settings.notification_email;
  if (!to) return;

  const transporter = await createTransporter();
  if (!transporter) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#175550;">New Mentor Application Pending</h2>
      <p>A new mentor application has been submitted and requires your review.</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px;margin:16px 0;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Name</td><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(mentorName)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Email</td><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(mentorEmail)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Occupation</td><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(occupation || "Not provided")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Organization</td><td style="padding:8px;">${escapeHtml(organization || "Not provided")}</td></tr>
      </table>
      <p style="margin:24px 0;">
        <a href="${siteUrl}/admin/mentors" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Review Applications
        </a>
      </p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
      <p style="font-size:12px;color:#888;">My True Siblings Initiative</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: settings.smtp_from || settings.smtp_user,
      to,
      subject: "New Mentor Application - My True Siblings Initiative",
      html,
    });
  } catch (err) {
    console.error("Failed to send new mentor pending email:", err);
  }
}

export async function sendNewSupportRequestEmail(
  userName: string,
  userEmail: string,
  type: string,
  subject: string,
  description: string
) {
  const settings = await getSettings();
  const to = settings.notification_email;
  if (!to) return;

  const transporter = await createTransporter();
  if (!transporter) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const typeLabels: Record<string, string> = {
    financial_assistance: "Financial Assistance",
    general_support: "General Support",
    other: "Other",
  };

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#175550;">New Support Request</h2>
      <p>A sibling has submitted a support request.</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px;margin:16px 0;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">From</td><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(userName)} (${escapeHtml(userEmail)})</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Type</td><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(typeLabels[type] || type)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Subject</td><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(subject)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Description</td><td style="padding:8px;">${escapeHtml(description)}</td></tr>
      </table>
      <p style="margin:24px 0;">
        <a href="${siteUrl}/admin/support" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          View Support Requests
        </a>
      </p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
      <p style="font-size:12px;color:#888;">My True Siblings Initiative</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: settings.smtp_from || settings.smtp_user,
      to,
      subject: `New Support Request: ${subject} - My True Siblings Initiative`,
      html,
    });
  } catch (err) {
    console.error("Failed to send support request email:", err);
  }
}

export async function sendSupportReplyEmail(
  toEmail: string,
  toName: string,
  requestSubject: string,
  replyMessage: string
) {
  const settings = await getSettings();
  const transporter = await createTransporter();
  if (!transporter) return;

  const from = settings.smtp_from || settings.smtp_user;
  if (!from) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#175550;">My True Siblings Initiative</h2>
      <p>Dear ${escapeHtml(toName)},</p>
      <p>You have received a reply regarding your support request: <strong>${escapeHtml(requestSubject)}</strong></p>
      <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;white-space:pre-wrap;">${escapeHtml(replyMessage)}</p>
      </div>
      <p style="margin:24px 0;">
        <a href="${siteUrl}/account/support" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          View Your Request
        </a>
      </p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
      <p style="font-size:12px;color:#888;">My True Siblings Initiative</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `Reply to Your Support Request - My True Siblings Initiative`,
      html,
    });
  } catch (err) {
    console.error("Failed to send support reply email:", err);
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationLink: string
) {
  const settings = await getSettings();
  const transporter = await createTransporter();
  if (!transporter) return;

  const from = settings.smtp_from || settings.smtp_user;
  if (!from) return;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#175550;">Welcome to My True Siblings Initiative</h2>
      <p>Dear ${escapeHtml(name)},</p>
      <p>Thank you for creating an account. Please verify your email address by clicking the button below.</p>
      <p style="margin:24px 0;">
        <a href="${verificationLink}" style="display:inline-block;background:#175550;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Verify Email Address
        </a>
      </p>
      <p style="font-size:12px;color:#888;">
        If the button doesn't work, copy this link: ${verificationLink}
      </p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
      <p style="font-size:12px;color:#888;">
        If you didn't create an account, you can safely ignore this email.<br/>
        This link expires in 24 hours.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify your email - My True Siblings Initiative",
      html,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
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
