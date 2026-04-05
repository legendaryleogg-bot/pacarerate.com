// js/detail-panel.js
// Manages the county detail panel below the map.

function showDetailPanel(countyData) {
  var panel = document.getElementById('detail-panel');
  var nameEl = document.getElementById('panel-county-name');
  var statsEl = document.getElementById('panel-stats');
  var insufficientEl = document.getElementById('panel-insufficient');
  var medianEl = document.getElementById('panel-median');
  var rangeEl = document.getElementById('panel-range');
  var countEl = document.getElementById('panel-count');

  nameEl.textContent = countyData.county + ' County';
  panel.classList.add('visible');

  if (countyData.status === 'insufficient_data') {
    statsEl.style.display = 'none';
    insufficientEl.style.display = 'block';
  } else {
    statsEl.style.display = 'block';
    insufficientEl.style.display = 'none';
    medianEl.textContent = '$' + countyData.median.toFixed(2) + '/hr';
    rangeEl.textContent = '$' + countyData.p25.toFixed(2) + ' \u2013 $' + countyData.p75.toFixed(2);
    countEl.textContent = countyData.report_count + ' caregiver reports';
  }
}

function hideDetailPanel() {
  document.getElementById('detail-panel').classList.remove('visible');
}
