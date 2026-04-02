// workers/src/index.js
import { handleSubmit } from './submit.js';
import { handleRatesAll, handleRatesCounty } from './rates.js';
import { PA_COUNTIES_SET } from './counties.js';

function getCorsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.SITE_ORIGIN || 'https://pacarerate.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function corsResponse(response, corsHeaders) {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}

export default {
  async fetch(request, env) {
    const CORS_HEADERS = getCorsHeaders(env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Public config endpoint — no secrets, just public keys and URLs
      if (path === '/api/config' && request.method === 'GET') {
        return corsResponse(new Response(JSON.stringify({
          turnstile_site_key: env.TURNSTILE_SITE_KEY || '',
          api_base: new URL(request.url).origin,
        }), {
          headers: { 'Content-Type': 'application/json' },
        }), CORS_HEADERS);
      }

      if (path === '/api/submit' && request.method === 'POST') {
        const response = await handleSubmit(request, env);
        return corsResponse(response, CORS_HEADERS);
      }

      if (path === '/api/rates' && request.method === 'GET') {
        const response = await handleRatesAll(env);
        return corsResponse(response, CORS_HEADERS);
      }

      const countyMatch = path.match(/^\/api\/rates\/(.+)$/);
      if (countyMatch && request.method === 'GET') {
        const county = decodeURIComponent(countyMatch[1]);
        if (!PA_COUNTIES_SET.has(county)) {
          return corsResponse(new Response(
            JSON.stringify({ error: 'Invalid county' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          ), CORS_HEADERS);
        }
        const response = await handleRatesCounty(county, env);
        return corsResponse(response, CORS_HEADERS);
      }

      return corsResponse(new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      ), CORS_HEADERS);

    } catch (err) {
      return corsResponse(new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      ), CORS_HEADERS);
    }
  },
};
