// js/config.js
// Fetches public config from the Worker API. No secrets — just public keys and URLs.
// All other JS files wait for this before making API calls.

var APP_CONFIG = null;

async function loadConfig() {
  if (APP_CONFIG) return APP_CONFIG;
  try {
    var response = await fetch('https://api.pacarerate.com/api/config');
    if (!response.ok) throw new Error('Config fetch failed');
    APP_CONFIG = await response.json();
  } catch (e) {
    // Fallback — if config endpoint is unreachable, use safe defaults
    APP_CONFIG = {
      api_base: 'https://api.pacarerate.com',
      turnstile_site_key: ''
    };
  }
  return APP_CONFIG;
}
