// js/rates.js
// Fetches aggregated rate data from the Worker API.

var API_BASE = 'https://pacarerate-api.jarrod-7fa.workers.dev'; // Update after deploy

async function fetchAllRates() {
  var response = await fetch(API_BASE + '/api/rates');
  if (!response.ok) return {};
  return response.json();
}

async function fetchCountyRates(county) {
  var response = await fetch(API_BASE + '/api/rates/' + encodeURIComponent(county));
  if (!response.ok) return null;
  return response.json();
}
