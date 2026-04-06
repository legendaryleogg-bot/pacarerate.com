    // ── Gate state ───────────────────────────────────────────────────────────
    const UNLOCK_KEY = 'pacarerate_unlocked';
    let mapUnlocked = localStorage.getItem(UNLOCK_KEY) === '1';

    // PA counties for the gate dropdown
    const PA_COUNTY_LIST = [
      "Adams","Allegheny","Armstrong","Beaver","Bedford","Berks","Blair","Bradford",
      "Bucks","Butler","Cambria","Cameron","Carbon","Centre","Chester","Clarion",
      "Clearfield","Clinton","Columbia","Crawford","Cumberland","Dauphin","Delaware",
      "Elk","Erie","Fayette","Forest","Franklin","Fulton","Greene","Huntingdon",
      "Indiana","Jefferson","Juniata","Lackawanna","Lancaster","Lawrence","Lebanon",
      "Lehigh","Luzerne","Lycoming","McKean","Mercer","Mifflin","Monroe","Montgomery",
      "Montour","Northampton","Northumberland","Perry","Philadelphia","Pike","Potter",
      "Schuylkill","Snyder","Somerset","Sullivan","Susquehanna","Tioga","Union",
      "Venango","Warren","Washington","Wayne","Westmoreland","Wyoming","York"
    ];

    function initGate() {
      const gate = document.getElementById('map-gate');
      const gateWrap = document.getElementById('map-gate-wrap');
      const container = document.getElementById('map-container');
      const searchBlock = document.querySelector('.search-block');

      if (mapUnlocked) {
        if (gateWrap) gateWrap.classList.add('hidden');
        // Update CTA for returning unlocked users
        const ctaBtn = document.getElementById('cta-btn');
        const ctaText = document.getElementById('cta-text');
        if (ctaBtn) ctaBtn.textContent = 'Contribute More';
        if (ctaText) ctaText.textContent = 'Add employer, job type, and other details to your submission.';
        return;
      }

      // Lock the map and related elements
      container.classList.add('locked');
      if (searchBlock) searchBlock.classList.add('locked');
      const caption = document.querySelector('.map-caption');
      const ctaSection = document.getElementById('cta-section');
      if (caption) caption.classList.add('locked');
      if (ctaSection) ctaSection.classList.add('locked');
      document.querySelectorAll('.map-instruction').forEach(el => el.classList.add('locked'));

      // Populate county dropdown
      const select = document.getElementById('gate-county');
      PA_COUNTY_LIST.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
      });

      // Render Turnstile in invisible mode — no visible widget
      let gateTurnstileId = null;
      let pendingSubmit = null;

      let readyToken = '';

      function renderGateTurnstile() {
        if (typeof turnstile !== 'undefined') {
          gateTurnstileId = turnstile.render('#gate-turnstile', {
            sitekey: '0x4AAAAAACzAMQ1ULEiIS32g',
            size: 'compact',
            appearance: 'interaction-only',
            action: 'submit-rate',
            callback: function(token) {
              readyToken = token;
              // If a submit is pending, fire it now
              if (pendingSubmit) {
                const fn = pendingSubmit;
                pendingSubmit = null;
                fn(token);
              }
            }
          });
        } else {
          setTimeout(renderGateTurnstile, 200);
        }
      }
      renderGateTurnstile();

      // Handle submit
      document.getElementById('gate-submit').addEventListener('click', function() {
        const rate = parseFloat(document.getElementById('gate-rate').value);
        const county = document.getElementById('gate-county').value;
        const msg = document.getElementById('gate-msg');
        const btn = this;

        if (!rate || rate < 5 || rate > 75) {
          msg.textContent = 'Enter an hourly rate between $5 and $75.';
          return;
        }
        if (!county) {
          msg.textContent = 'Select your county.';
          return;
        }

        msg.textContent = '';
        btn.disabled = true;

        // Token already available — submit instantly
        if (readyToken) {
          doGateSubmit(readyToken, rate, county, btn, msg);
          return;
        }

        // Token not ready yet — wait for callback
        btn.textContent = 'Verifying…';
        pendingSubmit = function(token) {
          doGateSubmit(token, rate, county, btn, msg);
        };
      });

      async function doGateSubmit(turnstileToken, rate, county, btn, msg) {
        btn.textContent = 'Submitting…';

        try {
          const response = await fetch(API_BASE + '/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rate, county, state: 'PA', turnstile_token: turnstileToken })
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Submission failed');
          }

          // Unlock + store gate data for /submit/ pre-fill
          localStorage.setItem(UNLOCK_KEY, '1');
          localStorage.setItem('pacarerate_gate_rate', rate);
          localStorage.setItem('pacarerate_gate_county', county);
          mapUnlocked = true;
          if (gateWrap) gateWrap.classList.add('hidden');
          container.classList.remove('locked');
          if (searchBlock) searchBlock.classList.remove('locked');
          const captionEl = document.querySelector('.map-caption');
          const ctaEl = document.getElementById('cta-section');
          if (captionEl) captionEl.classList.remove('locked');
          if (ctaEl) ctaEl.classList.remove('locked');
          document.querySelectorAll('.map-instruction').forEach(el => el.classList.remove('locked'));

          // Update CTA
          const ctaBtnEl = document.getElementById('cta-btn');
          const ctaTextEl = document.getElementById('cta-text');
          if (ctaBtnEl) ctaBtnEl.textContent = 'Contribute More';
          if (ctaTextEl) ctaTextEl.textContent = 'Add employer, job type, and other details to your submission.';

          // Reload rate data and recolor the map
          await loadRateData();
          document.getElementById('legend-min').textContent = '$' + RATE_MIN.toFixed(2);
          document.getElementById('legend-max').textContent = '$' + RATE_MAX.toFixed(2);
          d3.selectAll('.pa-county').attr('fill', function(d) {
            const name = PA_FIPS[String(d.id)];
            return name && countyByName[name] ? getRateColor(countyByName[name].median) : '#1a3a6e';
          });

        } catch (err) {
          msg.textContent = err.message || 'Something went wrong. Try again.';
          btn.disabled = false;
          btn.textContent = 'Unlock the Map';
          // Reset Turnstile for retry
          if (gateTurnstileId !== null) try { turnstile.reset(gateTurnstileId); } catch(e) {}
        }
      }
    }

    // Initialize gate immediately — don't wait for map data
    initGate();

    function populateProofBlock() {
      if (mapUnlocked || counties.length === 0) return;
      // Sort by median to find high, mid, low
      const sorted = [...counties].sort((a, b) => b.median - a.median);
      const high = sorted[0];
      const low = sorted[sorted.length - 1];
      const mid = sorted[Math.floor(sorted.length / 2)];
      const rawTotal = counties.reduce((sum, c) => sum + c.reports, 0);
      const totalReports = rawTotal < 100 ? rawTotal : Math.floor(rawTotal / 10) * 10 + '+';

      const cardsEl = document.getElementById('proof-cards');
      const statsEl = document.getElementById('proof-stats');
      if (!cardsEl || !statsEl) return;

      [high, mid, low].forEach(c => {
        const card = document.createElement('div');
        card.className = 'proof-card';
        card.innerHTML = '<div class="proof-card-county">' + c.county + '</div>'
          + '<div class="proof-card-rate">$' + c.median.toFixed(2) + '</div>'
          + '<div class="proof-card-label">median/hr</div>';
        cardsEl.appendChild(card);
      });

      statsEl.innerHTML = '<strong>' + counties.length + '</strong> counties tracked · <strong>' + totalReports + '</strong> data points';
    }

    // ── County data (fetched from live API) ─────────────────────────────────
    const API_BASE = 'https://api.pacarerate.com';
    let RATE_MIN = 16.25;
    let RATE_MAX = 18.50;
    let counties = [];
    let countyByName = {};

    async function loadRateData() {
      try {
        const response = await fetch(API_BASE + '/api/rates');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        // API returns { "County Name": { median, p25, p75, report_count }, ... }
        counties = Object.entries(data).map(([name, stats]) => ({
          county: name,
          median: stats.median,
          p25: stats.p25,
          p75: stats.p75,
          reports: stats.report_count
        }));
        countyByName = Object.fromEntries(counties.map(c => [c.county, c]));
        // Compute actual min/max from data
        const medians = counties.map(c => c.median);
        if (medians.length > 0) {
          RATE_MIN = Math.min(...medians);
          RATE_MAX = Math.max(...medians);
        }
      } catch (err) {
        console.error('Failed to load rate data:', err);
      }
    }

    // PA FIPS → county name
    const PA_FIPS = {
      '42001':'Adams','42003':'Allegheny','42005':'Armstrong','42007':'Beaver','42009':'Bedford',
      '42011':'Berks','42013':'Blair','42015':'Bradford','42017':'Bucks','42019':'Butler',
      '42021':'Cambria','42023':'Cameron','42025':'Carbon','42027':'Centre','42029':'Chester',
      '42031':'Clarion','42033':'Clearfield','42035':'Clinton','42037':'Columbia','42039':'Crawford',
      '42041':'Cumberland','42043':'Dauphin','42045':'Delaware','42047':'Elk','42049':'Erie',
      '42051':'Fayette','42053':'Forest','42055':'Franklin','42057':'Fulton','42059':'Greene',
      '42061':'Huntingdon','42063':'Indiana','42065':'Jefferson','42067':'Juniata','42069':'Lackawanna',
      '42071':'Lancaster','42073':'Lawrence','42075':'Lebanon','42077':'Lehigh','42079':'Luzerne',
      '42081':'Lycoming','42083':'McKean','42085':'Mercer','42087':'Mifflin','42089':'Monroe',
      '42091':'Montgomery','42093':'Montour','42095':'Northampton','42097':'Northumberland',
      '42099':'Perry','42101':'Philadelphia','42103':'Pike','42105':'Potter','42107':'Schuylkill',
      '42109':'Snyder','42111':'Somerset','42113':'Sullivan','42115':'Susquehanna','42117':'Tioga',
      '42119':'Union','42121':'Venango','42123':'Warren','42125':'Washington','42127':'Wayne',
      '42129':'Westmoreland','42131':'Wyoming','42133':'York',
    };

    function getRateColor(median) {
      const t = Math.max(0, Math.min(1, (median - RATE_MIN) / (RATE_MAX - RATE_MIN)));
      if (t < 0.5) {
        const s = t / 0.5;
        return `rgb(${Math.round(15+s*(37-15))},${Math.round(45+s*(99-45))},${Math.round(92+s*(155-92))})`;
      } else {
        const s = (t - 0.5) / 0.5;
        return `rgb(${Math.round(37+s*(249-37))},${Math.round(99+s*(115-99))},${Math.round(155+s*(22-155))})`;
      }
    }

    // ── State ────────────────────────────────────────────────────────────────
    let selectedCounty = null;
    let isTouch = false;
    window.addEventListener('touchstart', () => { isTouch = true; }, { once: true });

    // ── Navbar hamburger ─────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Open menu');
    }

    // ── Detail panel ─────────────────────────────────────────────────────────
    function selectCounty(county) {
      selectedCounty = county;
      // Sync search input
      document.getElementById('county-input').value = county.county;
      closeDropdown();
      clearBtn.classList.toggle('visible', true);
      // Update map strokes
      updateMapStrokes();
    }

    // ── D3 Map ───────────────────────────────────────────────────────────────
    const VW = 960, VH = 500;
    const mapSvg = d3.select('#map-svg').attr('viewBox', `0 0 ${VW} ${VH}`);
    const g = mapSvg.append('g').attr('id', 'zoom-group');
    let zoomBehavior, zoomScale = 1;

    // Map tooltip elements
    const mapTooltip  = document.getElementById('map-tooltip');
    const tipName     = document.getElementById('tip-name');
    const tipMedian   = document.getElementById('tip-median');
    const tipRange    = document.getElementById('tip-range');

    function showTooltip(event, county) {
      const container = document.getElementById('map-container');
      const rect = container.getBoundingClientRect();
      const tipW = 155;
      if (isTouch) {
        // Center tooltip at bottom of map on mobile (above the legend)
        mapTooltip.style.left = Math.max(8, (container.clientWidth - tipW) / 2) + 'px';
        mapTooltip.style.top = '';
        mapTooltip.style.bottom = '14px';
      } else {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const left = x + 16 + tipW > container.clientWidth ? x - tipW - 8 : x + 14;
        mapTooltip.style.left = left + 'px';
        mapTooltip.style.bottom = '';
        mapTooltip.style.top  = Math.max(8, y - 52) + 'px';
      }
      mapTooltip.style.display = 'block';
      tipName.textContent   = county.county + ' County';
      tipMedian.textContent = `$${county.median.toFixed(2)}/hr median`;
      tipRange.textContent  = `$${county.p25.toFixed(2)} – $${county.p75.toFixed(2)} range`;
    }

    function moveTooltip(event) {
      if (isTouch) return;
      const container = document.getElementById('map-container');
      const rect = container.getBoundingClientRect();
      const tipW = 155;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const left = x + 16 + tipW > container.clientWidth ? x - tipW - 8 : x + 14;
      mapTooltip.style.left = left + 'px';
      mapTooltip.style.top  = Math.max(8, y - 52) + 'px';
    }

    function hideTooltip() { mapTooltip.style.display = 'none'; }

    function updateMapStrokes() {
      g.selectAll('.pa-county')
        .attr('stroke', d => PA_FIPS[String(d.id)] === selectedCounty?.county ? '#f97316' : '#1a365d')
        .attr('stroke-width', d => PA_FIPS[String(d.id)] === selectedCounty?.county ? 2.5 : 0.8);
    }

    function setZoomed(scale) {
      zoomScale = scale;
      const zoomed = scale > 1.05;
      document.getElementById('btn-reset').classList.toggle('visible', zoomed);
      document.getElementById('scroll-hint-map').classList.toggle('visible', !zoomed);
      document.getElementById('map-svg').style.cursor = zoomed ? 'grab' : 'default';
    }

    // Load rate data first, then load the map
    loadRateData().then(() => {
      // Update legend with live min/max
      document.getElementById('legend-min').textContent = `$${RATE_MIN.toFixed(2)}`;
      document.getElementById('legend-max').textContent = `$${RATE_MAX.toFixed(2)}`;

      // Populate proof cards if gate is showing
      populateProofBlock();

      return fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
    })
      .then(r => r.json())
      .then(us => {
        document.getElementById('map-loading').style.display = 'none';
        document.getElementById('zoom-controls').classList.add('visible');
        document.getElementById('scroll-hint-map').classList.add('visible');
        document.getElementById('map-legend').classList.add('visible');

        // Zoom
        zoomBehavior = d3.zoom()
          .scaleExtent([1, 12])
          .translateExtent([[0, 0], [VW, VH]])
          .on('zoom', event => {
            g.attr('transform', event.transform);
            setZoomed(event.transform.k);
          });
        mapSvg.call(zoomBehavior);

        // Filter PA counties
        const allCounties = topojson.feature(us, us.objects.counties);
        const paFeatures  = allCounties.features.filter(f => Math.floor(Number(f.id) / 1000) === 42);
        const paGeoJSON   = { type: 'FeatureCollection', features: paFeatures };

        const projection = d3.geoMercator().fitExtent([[20,20],[VW-20,VH-20]], paGeoJSON);
        const pathGen    = d3.geoPath().projection(projection);

        const countyGroup = g.append('g').attr('id', 'county-fills');
        const labelGroup  = g.append('g').attr('id', 'county-labels').attr('pointer-events', 'none');

        // County fills
        countyGroup.selectAll('.pa-county')
          .data(paFeatures)
          .join('path')
          .attr('class', 'pa-county')
          .attr('d', d => pathGen(d) ?? '')
          .attr('fill', d => {
            const name = PA_FIPS[String(d.id)];
            return name && countyByName[name] ? getRateColor(countyByName[name].median) : '#1a3a6e';
          })
          .attr('stroke', '#1a365d')
          .attr('stroke-width', 0.8)
          .attr('stroke-linejoin', 'round')
          .style('cursor', 'pointer')
          .on('mouseenter', function(event, d) {
            if (isTouch) return;
            const name = PA_FIPS[String(d.id)];
            const data = name ? countyByName[name] : null;
            if (!data) return;
            d3.select(this).raise()
              .attr('stroke', '#f97316')
              .attr('stroke-width', 2.5)
              .attr('filter', 'brightness(1.2)');
            showTooltip(event, data);
          })
          .on('mousemove', function(event) { moveTooltip(event); })
          .on('mouseleave', function(event, d) {
            const name = PA_FIPS[String(d.id)];
            const isSel = selectedCounty?.county === name;
            d3.select(this)
              .attr('stroke', isSel ? '#f97316' : '#1a365d')
              .attr('stroke-width', isSel ? 2.5 : 0.8)
              .attr('filter', null);
            hideTooltip();
          })
          .on('click', function(event, d) {
            const name = PA_FIPS[String(d.id)];
            const data = name ? countyByName[name] : null;
            if (data) {
              selectCounty(data);
              showTooltip(event, data);
            }
          });

        // County labels
        labelGroup.selectAll('.pa-county-label')
          .data(paFeatures)
          .join('text')
          .attr('class', 'pa-county-label')
          .attr('transform', d => { const [cx,cy] = pathGen.centroid(d); return `translate(${cx},${cy})`; })
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('pointer-events', 'none')
          .attr('fill', 'rgba(255,255,255,0.72)')
          .attr('font-size', '7px')
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-weight', '600')
          .attr('letter-spacing', '0.02em')
          .text(d => { const n = PA_FIPS[String(d.id)] ?? ''; return n.length > 10 ? n.slice(0,9)+'.' : n; });

        // State border
        const allStates = topojson.feature(us, us.objects.states);
        const paState   = allStates.features.find(f => Number(f.id) === 42);
        if (paState) {
          g.append('path')
            .datum(paState)
            .attr('d', pathGen(paState) ?? '')
            .attr('fill', 'none')
            .attr('stroke', 'rgba(255,255,255,0.45)')
            .attr('stroke-width', 2)
            .attr('stroke-linejoin', 'round')
            .attr('pointer-events', 'none');
        }
      })
      .catch(() => {
        document.getElementById('map-loading').style.display = 'none';
        const err = document.getElementById('map-error');
        err.style.display = 'flex';
      });

    // Zoom buttons
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      mapSvg.transition().duration(300).call(zoomBehavior.scaleBy, 2);
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      mapSvg.transition().duration(300).call(zoomBehavior.scaleBy, 0.5);
    });
    document.getElementById('btn-reset').addEventListener('click', () => {
      mapSvg.transition().duration(400).call(zoomBehavior.transform, d3.zoomIdentity);
    });

    // ── County search ────────────────────────────────────────────────────────
    const input      = document.getElementById('county-input');
    const clearBtn   = document.getElementById('clear-btn');
    const dropdown   = document.getElementById('search-dropdown');
    let activeIndex  = -1;
    let matches      = [];

    function openDropdown() {
      dropdown.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
    }
    function closeDropdown() {
      dropdown.classList.remove('open');
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    }

    function renderDropdown() {
      if (matches.length === 0) {
        dropdown.innerHTML = '<div class="drop-empty">No counties found</div>';
      } else {
        dropdown.innerHTML = matches.map((item, i) => `
          <div class="drop-item${i === activeIndex ? ' active' : ''}" data-index="${i}" role="option" aria-selected="${i === activeIndex}">
            <span>${item.county}</span>
            <span class="drop-rate">$${item.median.toFixed(2)}/hr</span>
          </div>
        `).join('');
        // Bind click/hover
        dropdown.querySelectorAll('.drop-item').forEach(el => {
          el.addEventListener('mousedown', e => {
            e.preventDefault();
            const idx = parseInt(el.dataset.index);
            selectCounty(matches[idx]);
          });
          el.addEventListener('mouseenter', () => {
            activeIndex = parseInt(el.dataset.index);
            renderDropdown();
          });
        });
      }
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      clearBtn.classList.toggle('visible', input.value.length > 0);
      activeIndex = -1;
      if (q.length === 0) { matches = []; closeDropdown(); return; }
      matches = counties.filter(c => c.county.toLowerCase().includes(q));
      renderDropdown();
      openDropdown();
    });

    input.addEventListener('focus', () => {
      if (input.value.trim() && matches.length > 0) openDropdown();
    });

    input.addEventListener('blur', () => {
      setTimeout(closeDropdown, 150);
    });

    input.addEventListener('keydown', e => {
      if (!dropdown.classList.contains('open') || matches.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, matches.length - 1);
        renderDropdown();
        scrollActiveItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderDropdown();
        scrollActiveItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && matches[activeIndex]) selectCounty(matches[activeIndex]);
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    function scrollActiveItem() {
      const el = dropdown.querySelector(`[data-index="${activeIndex}"]`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }

    clearBtn.addEventListener('mousedown', e => {
      e.preventDefault();
      input.value = '';
      matches = [];
      clearBtn.classList.remove('visible');
      closeDropdown();
      input.focus();
    });
