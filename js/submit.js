// js/submit.js
// Handles form validation, Turnstile token retrieval, and submission to Worker API.

const API_BASE = 'https://api.pacarerate.com'; // Update after deploy

(function () {
  // Populate county dropdown from canonical list
  var countySelect = document.getElementById('county');
  PA_COUNTIES.forEach(function (county) {
    var option = document.createElement('option');
    option.value = county;
    option.textContent = county;
    countySelect.appendChild(option);
  });

  // Satisfaction radio toggle
  document.querySelectorAll('.satisfaction-group label').forEach(function (label) {
    label.addEventListener('click', function () {
      document.querySelectorAll('.satisfaction-group label').forEach(function (l) {
        l.classList.remove('selected');
      });
      label.classList.add('selected');
    });
  });

  // Form submission
  var form = document.getElementById('rate-form');
  var errorEl = document.getElementById('form-error');
  var formWrapper = document.getElementById('form-wrapper');
  var successEl = document.getElementById('form-success');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorEl.classList.remove('visible');

    var rate = document.getElementById('rate').value;
    var county = document.getElementById('county').value;
    var employerName = document.getElementById('employer_name').value;
    var jobType = document.getElementById('job_type').value;
    var hoursPerWeek = document.getElementById('hours_per_week').value;

    var benefitEls = document.querySelectorAll('input[name="benefits"]:checked');
    var benefits = [];
    benefitEls.forEach(function (el) { benefits.push(el.value); });

    var satEl = document.querySelector('input[name="satisfaction"]:checked');
    var satisfaction = satEl ? satEl.value : '';

    var errors = [];
    if (!rate || isNaN(rate) || Number(rate) < 5 || Number(rate) > 75) {
      errors.push('Hourly rate must be between $5 and $75.');
    }
    if (!county) {
      errors.push('Please select your county.');
    }

    if (errors.length > 0) {
      errorEl.textContent = errors.join(' ');
      errorEl.classList.add('visible');
      return;
    }

    var turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
    var turnstileToken = turnstileResponse ? turnstileResponse.value : '';

    if (!turnstileToken) {
      errorEl.textContent = 'Please complete the verification check.';
      errorEl.classList.add('visible');
      return;
    }

    var payload = {
      rate: Number(rate),
      county: county,
      turnstile_token: turnstileToken,
    };
    if (employerName) payload.employer_name = employerName;
    if (jobType) payload.job_type = jobType;
    if (hoursPerWeek) payload.hours_per_week = Number(hoursPerWeek);
    if (benefits.length > 0) payload.benefits = benefits;
    if (satisfaction) payload.satisfaction = Number(satisfaction);

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      var response = await fetch(API_BASE + '/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      var result = await response.json();

      if (!response.ok) {
        errorEl.textContent = result.error || 'Something went wrong. Please try again.';
        errorEl.classList.add('visible');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit My Rate';
        return;
      }

      formWrapper.style.display = 'none';
      successEl.classList.add('visible');
    } catch (err) {
      errorEl.textContent = 'Network error. Please check your connection and try again.';
      errorEl.classList.add('visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit My Rate';
    }
  });
})();
