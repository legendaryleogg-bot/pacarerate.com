import { PA_COUNTIES_SET } from './counties.js';

const MIN_RATE = 5;
const MAX_RATE = 75;

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

  return errors;
}
