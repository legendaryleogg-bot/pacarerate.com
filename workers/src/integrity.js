const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_HOURS = 24;

export async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function checkRateLimit(db, ipHash) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();

  const row = await db.prepare(
    'SELECT submission_count, window_start FROM rate_limits WHERE ip_hash = ?'
  ).bind(ipHash).first();

  if (!row) {
    return { allowed: true, isNew: true };
  }

  if (row.window_start < windowStart) {
    return { allowed: true, isNew: false, expired: true };
  }

  if (row.submission_count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return { allowed: false, isNew: false };
  }

  return { allowed: true, isNew: false };
}

export async function recordSubmission(db, ipHash) {
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO rate_limits (ip_hash, submission_count, window_start)
    VALUES (?, 1, ?)
    ON CONFLICT(ip_hash) DO UPDATE SET
      submission_count = CASE
        WHEN window_start < ? THEN 1
        ELSE submission_count + 1
      END,
      window_start = CASE
        WHEN window_start < ? THEN ?
        ELSE window_start
      END
  `).bind(
    ipHash,
    now,
    new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString(),
    new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString(),
    now
  ).run();
}

export async function checkDuplicate(db, ipHash, county, rate) {
  const windowStart = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();

  const row = await db.prepare(`
    SELECT id FROM submissions
    WHERE ip_hash = ? AND county = ? AND rate = ? AND created_at > ?
    LIMIT 1
  `).bind(ipHash, county, rate, windowStart).first();

  return !!row;
}
