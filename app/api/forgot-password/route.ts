import { Resend } from "resend";
import { storeResetToken } from "@/lib/reset-tokens";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { username, email } = await request.json();

  if (!username || !email || typeof username !== "string" || typeof email !== "string") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const token = crypto.randomUUID();
  storeResetToken(token, username);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}&username=${encodeURIComponent(username)}`;

  const { error } = await resend.emails.send({
    from: "Employee Directory <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Reset your password</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
          Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
          style="display:inline-block;background:#8b5cf6;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
          Reset Password
        </a>
        <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: `Resend: ${error.message}` }, { status: 500 });
  }

  return Response.json({ success: true });
}
