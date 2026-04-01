import { validateSubmission } from './validation.js';
import { normalizeEmployerName } from './normalize.js';
import { hashIP, checkRateLimit, recordSubmission, checkDuplicate } from './integrity.js';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

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
  return outcome.success === true;
}

export async function handleSubmit(request, env) {
  let body;
  try {
    body = await request.json();
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

  const ipHash = await hashIP(ip);
  const rateLimit = await checkRateLimit(env.DB, ipHash);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again tomorrow.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rate = Number(body.rate);
  const isDuplicate = await checkDuplicate(env.DB, ipHash, body.county, rate);
  const status = isDuplicate ? 'flagged' : 'active';

  const employerNameRaw = body.employer_name || null;
  const employerName = normalizeEmployerName(employerNameRaw);

  const satisfaction = body.satisfaction ? Number(body.satisfaction) : null;
  const hoursPerWeek = body.hours_per_week ? Number(body.hours_per_week) : null;
  const jobType = body.job_type || null;
  const benefits = body.benefits ? JSON.stringify(body.benefits) : null;

  await env.DB.prepare(`
    INSERT INTO submissions (rate, state, county, employer_name_raw, employer_name,
      job_type, hours_per_week, benefits, satisfaction, status, ip_hash)
    VALUES (?, 'PA', ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    rate, body.county, employerNameRaw, employerName,
    jobType, hoursPerWeek, benefits, satisfaction, status, ipHash
  ).run();

  await recordSubmission(env.DB, ipHash);

  if (isDuplicate) {
    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you! Your submission is being reviewed.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Thank you for sharing your rate!'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
