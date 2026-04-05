import { validateSubmission } from './validation.js';
import { normalizeEmployerName } from './normalize.js';
import { hashIP, checkRateLimit, recordSubmission, checkDuplicate } from './integrity.js';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_ALLOWED_HOSTNAMES = new Set([
  'pacarerate.com',
  'staging.pacarerate-com.pages.dev'
]);

async function verifyTurnstile(token, secretKey, ip) {
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  formData.append('remoteip', ip);

  const result = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body: formData,
  });
  const outcome = await result.json();
  if (!outcome.success) return false;

  // Validate hostname — reject tokens from unexpected domains
  if (outcome.hostname && !TURNSTILE_ALLOWED_HOSTNAMES.has(outcome.hostname) &&
      !/^[a-z0-9-]+\.pacarerate-com\.pages\.dev$/.test(outcome.hostname)) {
    return false;
  }

  return true;
}

const MAX_BODY_SIZE = 10 * 1024; // 10KB

export async function handleSubmit(request, env) {
  // Fail-closed: reject if Turnstile secret is not configured
  if (!env.TURNSTILE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Service configuration error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Body size limit — check header first, then actual body
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_SIZE) {
    return new Response(JSON.stringify({ error: 'Request too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    const rawText = await request.text();
    if (rawText.length > MAX_BODY_SIZE) {
      return new Response(JSON.stringify({ error: 'Request too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    body = JSON.parse(rawText);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const turnstileToken = body.turnstile_token;
  if (!turnstileToken) {
    return new Response(JSON.stringify({ error: 'Bot verification required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const turnstileValid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileValid) {
    return new Response(JSON.stringify({ error: 'Bot verification failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errors = validateSubmission(body);
  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: 'Validation failed', details: errors }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ipHash = await hashIP(ip, env.IP_HASH_SALT);
  const rateLimit = await checkRateLimit(env.DB, ipHash);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again tomorrow.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rate = Number(body.rate);
  const existingId = await checkDuplicate(env.DB, ipHash, body.county, rate);

  const employerNameRaw = body.employer_name || null;
  const employerName = normalizeEmployerName(employerNameRaw);

  const satisfaction = body.satisfaction ? Number(body.satisfaction) : null;
  const hoursPerWeek = body.hours_per_week ? Number(body.hours_per_week) : null;
  const jobType = body.job_type || null;
  const benefits = body.benefits ? JSON.stringify(body.benefits) : null;

  if (existingId) {
    // Enrich existing submission (same IP + county + rate within 24h)
    await env.DB.prepare(`
      UPDATE submissions SET
        employer_name_raw = COALESCE(?, employer_name_raw),
        employer_name = COALESCE(?, employer_name),
        job_type = COALESCE(?, job_type),
        hours_per_week = COALESCE(?, hours_per_week),
        benefits = COALESCE(?, benefits),
        satisfaction = COALESCE(?, satisfaction)
      WHERE id = ?
    `).bind(
      employerNameRaw, employerName,
      jobType, hoursPerWeek, benefits, satisfaction,
      existingId
    ).run();
  } else {
    // New submission
    await env.DB.prepare(`
      INSERT INTO submissions (rate, state, county, employer_name_raw, employer_name,
        job_type, hours_per_week, benefits, satisfaction, status, ip_hash)
      VALUES (?, 'PA', ?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `).bind(
      rate, body.county, employerNameRaw, employerName,
      jobType, hoursPerWeek, benefits, satisfaction, ipHash
    ).run();

    await recordSubmission(env.DB, ipHash);
  }

  return new Response(JSON.stringify({
    success: true,
    message: existingId ? 'Thank you! Your details have been added.' : 'Thank you for sharing your rate!'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
