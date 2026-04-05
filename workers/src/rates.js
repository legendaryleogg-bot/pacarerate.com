// workers/src/rates.js

export async function handleRatesAll(env) {
  const allRates = await env.DB.prepare(`
    SELECT county, rate
    FROM submissions
    WHERE status = 'active' AND state = 'PA'
    ORDER BY county, rate
  `).all();

  const counties = {};
  for (const row of allRates.results) {
    if (!counties[row.county]) counties[row.county] = [];
    counties[row.county].push(row.rate);
  }

  const result = {};
  for (const [county, rates] of Object.entries(counties)) {
    if (rates.length < 5) continue; // below threshold
    result[county] = computeStats(rates);
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleRatesCounty(county, env) {
  const allRates = await env.DB.prepare(`
    SELECT rate
    FROM submissions
    WHERE status = 'active' AND state = 'PA' AND county = ?
    ORDER BY rate
  `).bind(county).all();

  const rates = allRates.results.map(r => r.rate);

  if (rates.length < 5) {
    return new Response(JSON.stringify({
      county,
      status: 'insufficient_data',
      report_count: rates.length,
      threshold: 5
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stats = computeStats(rates);
  return new Response(JSON.stringify({ county, ...stats }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function computeStats(sortedRates) {
  const n = sortedRates.length;
  const median = n % 2 === 0
    ? (sortedRates[n / 2 - 1] + sortedRates[n / 2]) / 2
    : sortedRates[Math.floor(n / 2)];

  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const p25 = sortedRates[q1Index];
  const p75 = sortedRates[q3Index];

  return {
    median: Math.round(median * 100) / 100,
    p25: Math.round(p25 * 100) / 100,
    p75: Math.round(p75 * 100) / 100,
    report_count: n,
  };
}
