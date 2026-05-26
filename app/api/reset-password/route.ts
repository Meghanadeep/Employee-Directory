import { validateAndConsumeToken } from "@/lib/reset-tokens";

export async function POST(request: Request) {
  const { token, username } = await request.json();

  if (!token || !username || typeof token !== "string" || typeof username !== "string") {
    return Response.json({ error: "Missing token or username" }, { status: 400 });
  }

  const valid = validateAndConsumeToken(token, username);
  if (!valid) {
    return Response.json(
      { error: "Invalid or expired reset link. Please request a new one." },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
