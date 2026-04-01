// workers/src/index.js
import { handleSubmit } from './submit.js';
import { handleRatesAll, handleRatesCounty } from './rates.js';
import { PA_COUNTIES_SET } from './counties.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://pacarerate.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function corsResponse(response) {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/api/submit' && request.method === 'POST') {
        const response = await handleSubmit(request, env);
        return corsResponse(response);
      }

      if (path === '/api/rates' && request.method === 'GET') {
        const response = await handleRatesAll(env);
        return corsResponse(response);
      }

      const countyMatch = path.match(/^\/api\/rates\/(.+)$/);
      if (countyMatch && request.method === 'GET') {
        const county = decodeURIComponent(countyMatch[1]);
        if (!PA_COUNTIES_SET.has(county)) {
          return corsResponse(new Response(
            JSON.stringify({ error: 'Invalid county' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          ));
        }
        const response = await handleRatesCounty(county, env);
        return corsResponse(response);
      }

      return corsResponse(new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      ));

    } catch (err) {
      return corsResponse(new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      ));
    }
  },
};
