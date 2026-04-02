import { PA_COUNTIES_SET } from './counties.js';

const MIN_RATE = 5;
const MAX_RATE = 75;
const MAX_STRING_LENGTH = 200;
const MAX_BENEFITS = 10;
const VALID_JOB_TYPES = new Set([
  'personal care aide', 'home health aide', 'cna', 'companion', 'other'
]);

export function validateSubmission(body) {
  const errors = [];

  if (body.rate === undefined || body.rate === null) {
    errors.push('rate is required');
  } else {
    const rate = Number(body.rate);
    if (isNaN(rate) || rate < MIN_RATE || rate > MAX_RATE) {
      errors.push(`rate must be between $${MIN_RATE} and $${MAX_RATE}`);
    }
  }

  if (!body.county || typeof body.county !== 'string') {
    errors.push('county is required');
  } else if (!PA_COUNTIES_SET.has(body.county)) {
    errors.push('county must be a valid PA county');
  }

  if (body.satisfaction !== undefined && body.satisfaction !== null && body.satisfaction !== '') {
    const sat = Number(body.satisfaction);
    if (isNaN(sat) || !Number.isInteger(sat) || sat < 1 || sat > 5) {
      errors.push('satisfaction must be 1-5');
    }
  }

  if (body.hours_per_week !== undefined && body.hours_per_week !== null && body.hours_per_week !== '') {
    const hours = Number(body.hours_per_week);
    if (isNaN(hours) || !Number.isInteger(hours) || hours < 1 || hours > 168) {
      errors.push('hours_per_week must be 1-168');
    }
  }

  // String length limits
  if (body.employer_name && (typeof body.employer_name !== 'string' || body.employer_name.length > MAX_STRING_LENGTH)) {
    errors.push('employer_name must be a string under 200 characters');
  }

  // Job type enum
  if (body.job_type) {
    if (typeof body.job_type !== 'string' || !VALID_JOB_TYPES.has(body.job_type)) {
      errors.push('job_type must be one of: personal care aide, home health aide, cna, companion, other');
    }
  }

  // Benefits array validation
  if (body.benefits) {
    if (!Array.isArray(body.benefits) || body.benefits.length > MAX_BENEFITS) {
      errors.push('benefits must be an array with at most 10 items');
    } else if (body.benefits.some(b => typeof b !== 'string' || b.length > 50)) {
      errors.push('each benefit must be a string under 50 characters');
    }
  }

  return errors;
}
