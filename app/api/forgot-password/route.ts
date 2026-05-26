import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { email, username } = await request.json();

  if (!email || typeof email !== "string") {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = crypto.randomUUID();
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&username=${encodeURIComponent(username ?? "")}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Employee Directory" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your Employee Directory password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fdf6ed;border-radius:16px;">
          <h2 style="margin:0 0 8px;color:#1f2937;">Reset your password</h2>
          <p style="color:#6b7280;margin:0 0 24px;">Click the button below to reset your Employee Directory password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:#8b5cf6;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Reset Password</a>
          <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
