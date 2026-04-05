// js/rates.js
// Fetches aggregated rate data from the Worker API.

async function fetchAllRates() {
  var config = await loadConfig();
  var response = await fetch(config.api_base + '/api/rates');
  if (!response.ok) return {};
  return response.json();
}

async function fetchCountyRates(county) {
  var config = await loadConfig();
  var response = await fetch(config.api_base + '/api/rates/' + encodeURIComponent(county));
  if (!response.ok) return null;
  return response.json();
}
