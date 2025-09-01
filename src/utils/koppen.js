// src/utils/koppen.js
const GROUPS = {
  A: {
    name: 'Tropical',
    hints: ['No frost risk', 'Heat-tolerant crops', 'Watch wet-season disease'],
  },
  B: {
    name: 'Arid',
    hints: ['Irrigation essential', 'Mulch heavily', 'Wind/salt tolerance helpful'],
  },
  C: { name: 'Temperate', hints: ['Cool & warm seasons', 'Frost possible', 'Wide crop range'] },
  D: { name: 'Continental', hints: ['Cold winters', 'Short warm season', 'Frost-hardy varieties'] },
  E: { name: 'Polar', hints: ['Very short season', 'Protected culture needed'] },
};

const PRECIP = {
  f: { name: 'No dry season', seasonality: 'even' },
  s: { name: 'Dry summer', seasonality: 'summer-dry' },
  w: { name: 'Dry winter', seasonality: 'winter-dry' },
  m: { name: 'Monsoon', seasonality: 'monsoon' },
};

const TEMP_C_D = {
  a: { name: 'Hot summer', summers: 'hot', months10C: '≥4' },
  b: { name: 'Warm summer', summers: 'warm', months10C: '≥4' },
  c: { name: 'Cool summer', summers: 'cool', months10C: '1–3' },
  d: { name: 'Very cold winter', winters: 'severe' },
};

const TEMP_B = {
  h: { name: 'Hot arid', annualMean: '≥18°C' },
  k: { name: 'Cold arid', annualMean: '<18°C' },
};

export function parseKoppen(code) {
  if (!code || typeof code !== 'string') return null;
  const c = code.trim();
  const g = c[0]; // group
  const p = c[1]; // precip
  const t = c[2]; // temp qualifier
  const group = GROUPS[g] || { name: 'Unknown' };
  const precip = PRECIP[p] || null;

  let temp = null;
  if (g === 'C' || g === 'D') temp = TEMP_C_D[t] || null;
  else if (g === 'B') temp = TEMP_B[t] || null;

  // Derived heuristics you can use in UI logic
  const frostLikely =
    g === 'D' || g === 'E' || (g === 'C' && (t === 'b' || t === 'c' || t === 'd'));

  const irrigationStress = g === 'B' || (precip && precip.seasonality === 'summer-dry');

  const monsoon = precip && precip.seasonality === 'monsoon';

  return {
    code: c,
    group: { key: g, ...group },
    precip: precip ? { key: p, ...precip } : null,
    temp: temp ? { key: t, ...temp } : null,
    flags: { frostLikely, irrigationStress, monsoon },
  };
}

// Example high-level guidance from parsed pieces
export function zoneGuidance(parsed) {
  if (!parsed) return { bullets: [] };
  const bullets = [];

  if (parsed.flags.frostLikely) {
    bullets.push('Set first/last-frost dates and protect seedlings early/late season.');
  } else {
    bullets.push('Frost risk low; focus on heat/rain management.');
  }

  if (parsed.precip?.seasonality === 'summer-dry') {
    bullets.push('Plan drought-hardy summer crops and schedule irrigation/mulching.');
  }
  if (parsed.precip?.seasonality === 'winter-dry') {
    bullets.push('Leverage dry winters for soil work; manage heavy summer rains.');
  }
  if (parsed.flags.monsoon) {
    bullets.push('Stagger sowing to avoid peak deluge; ensure drainage and disease control.');
  }

  if (parsed.group?.name === 'Tropical') {
    bullets.push('Prioritize heat/disease-tolerant varieties; shade and airflow matter.');
  }
  if (parsed.group?.name === 'Continental') {
    bullets.push('Choose short-DTM varieties; start transplants indoors where possible.');
  }

  return { bullets };
}
