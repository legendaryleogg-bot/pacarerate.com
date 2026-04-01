// js/map.js
// Initializes Leaflet map, loads PA county GeoJSON, colors by rate data.

(async function () {
  var map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
  }).setView([41.0, -77.5], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 12,
    minZoom: 6,
  }).addTo(map);

  var rateData = await fetchAllRates();

  function getColor(median) {
    if (median >= 25) return '#22c55e';
    if (median >= 20) return '#84cc16';
    if (median >= 17) return '#eab308';
    if (median >= 14) return '#f97316';
    return '#ef4444';
  }

  function getStyle(feature) {
    var county = feature.properties.NAME;
    var data = rateData[county];

    if (!data) {
      return {
        fillColor: '#334155',
        weight: 1,
        color: 'rgba(255,255,255,0.2)',
        fillOpacity: 0.6,
      };
    }

    return {
      fillColor: getColor(data.median),
      weight: 1,
      color: 'rgba(255,255,255,0.3)',
      fillOpacity: 0.7,
    };
  }

  var geojsonLayer;

  function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#ffffff',
      fillOpacity: 0.85,
    });
    layer.bringToFront();
  }

  function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
  }

  async function onCountyClick(e) {
    var county = e.target.feature.properties.NAME;
    var data = await fetchCountyRates(county);
    if (data) {
      showDetailPanel(data);
    }
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: onCountyClick,
    });

    var county = feature.properties.NAME;
    var data = rateData[county];
    var tip = data
      ? county + ': $' + data.median.toFixed(2) + '/hr'
      : county + ': needs more reports';
    layer.bindTooltip(tip, { sticky: true });
  }

  var geoResponse = await fetch('/assets/pa-counties.geojson');
  var geoData = await geoResponse.json();

  geojsonLayer = L.geoJSON(geoData, {
    style: getStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);

  map.fitBounds(geojsonLayer.getBounds());
})();
