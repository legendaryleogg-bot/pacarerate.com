// Static alias table — maps known variants to canonical names.
// Maintained manually. Add entries as new variants are discovered.
const EMPLOYER_ALIASES = {
  // Example entries:
  // 'bayada': 'bayada home health care',
  // 'interim healthcare': 'interim healthcare',
};

export function normalizeEmployerName(raw) {
  if (!raw || typeof raw !== 'string') return null;

  let normalized = raw
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"]/g, '') // strip punctuation
    .replace(/\s+/g, ' '); // collapse multiple spaces

  if (normalized === '') return null;

  // Check alias table
  if (EMPLOYER_ALIASES[normalized]) {
    normalized = EMPLOYER_ALIASES[normalized];
  }

  return normalized;
}
