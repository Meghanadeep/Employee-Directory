interface ResetToken {
  username: string;
  expires: number;
}

// Module-level Map persists across requests within the same server process
const tokens = new Map<string, ResetToken>();

export function storeResetToken(token: string, username: string): void {
  tokens.set(token, { username, expires: Date.now() + 60 * 60 * 1000 }); // 1 hour
}

export function validateAndConsumeToken(token: string, username: string): boolean {
  const stored = tokens.get(token);
  if (!stored || stored.username !== username || Date.now() > stored.expires) {
    return false;
  }
  tokens.delete(token);
  return true;
}
